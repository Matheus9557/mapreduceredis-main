const { client, connectRedis } = require('./redisClient');
const { spawn } = require('child_process');
const fs = require('fs');
require('dotenv').config();

const TOTAL_MAPPERS = Number(process.env.MAPPER_COUNT);
const TOTAL_REDUCERS = Number(process.env.NUM_REDUCERS);

async function start() {
  await connectRedis();
  console.log('Coordenador iniciado');

  // Enfileirar tarefas para mappers
  for (let i = 0; i < TOTAL_MAPPERS; i++) {
    await client.lPush('mapperTasks', `chunk${i}.txt`);
  }

  // Aguardar conclusão dos mappers via pub/sub
  let completedMappers = 0;
  const sub = client.duplicate();
  await sub.connect();
  await sub.subscribe(process.env.REDIS_CHANNEL_MAPPER_DONE, (msg) => {
    completedMappers++;
    console.log(`Mapper finalizado: ${msg}`);
    if (completedMappers === TOTAL_MAPPERS) {
      sub.unsubscribe(process.env.REDIS_CHANNEL_MAPPER_DONE);
      runShuffler();
    }
  });
}

async function runShuffler() {
  console.log('Executando fase de shuffle...');
  const shuffler = spawn('node', ['shuffler.js'], { stdio: 'inherit' });

  shuffler.on('exit', async () => {
    // Enfileirar reducers
    for (let i = 0; i < TOTAL_REDUCERS; i++) {
      await client.lPush('reducerTasks', `input${i}.json`);
    }

    // Aguardar reducers
    let completedReducers = 0;
    const sub = client.duplicate();
    await sub.connect();
    await sub.subscribe(process.env.REDIS_CHANNEL_REDUCER_DONE, (msg) => {
      completedReducers++;
      console.log(`Reducer finalizado: ${msg}`);
      if (completedReducers === TOTAL_REDUCERS) {
        sub.unsubscribe(process.env.REDIS_CHANNEL_REDUCER_DONE);
        mergeResults();
      }
    });
  });
}

function mergeResults() {
  const files = fs.readdirSync('./reducer-output').filter(f => f.endsWith('.txt'));
  let final = '';

  for (const file of files) {
    final += fs.readFileSync(`./reducer-output/${file}`, 'utf-8') + '\n';
  }

  fs.writeFileSync('final-result.txt', final);
  console.log('Processamento completo. Resultado salvo em final-result.txt');
}

start();
