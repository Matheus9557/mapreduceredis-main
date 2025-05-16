const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
require('dotenv').config();

const NUM_REDUCERS = Number(process.env.NUM_REDUCERS);

function hashKey(key) {
  const hash = crypto.createHash('md5').update(key).digest('hex');
  return parseInt(hash, 16) % NUM_REDUCERS;
}

function shuffle() {
  const files = fs.readdirSync('./intermediate').filter(f => f.endsWith('.json'));
  const buckets = Array(NUM_REDUCERS).fill(null).map(() => ({}));

  for (const file of files) {
    const content = JSON.parse(fs.readFileSync(path.join('./intermediate', file), 'utf-8'));

    for (const [word, count] of Object.entries(content)) {
      const index = hashKey(word);
      if (!buckets[index][word]) {
        buckets[index][word] = [];
      }
      buckets[index][word].push(count);
    }
  }

  // Cria a pasta 'reducer-input' caso não exista
  const reducerInputPath = './reducer-input';
  if (!fs.existsSync(reducerInputPath)) {
    fs.mkdirSync(reducerInputPath);
  }

  // Escreve os arquivos de input para reducers
  for (let i = 0; i < NUM_REDUCERS; i++) {
    const filename = path.join(reducerInputPath, `input${i}.json`);
    fs.writeFileSync(filename, JSON.stringify(buckets[i]));
    console.log(`Shuffle → Criado ${filename}`);
  }
}

shuffle();
