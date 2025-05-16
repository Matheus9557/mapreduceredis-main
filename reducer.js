const redis = require('redis');
const fs = require('fs');
const path = require('path');

const client = redis.createClient({ url: 'redis://redis:6379' });

async function main() {
  await client.connect();

  const keys = await client.keys('map:*');
  const reducerId = Math.floor(Math.random() * 10000);

  console.log(`Reducer ${reducerId} iniciando...`);

  const results = {};

  for (const key of keys) {
    const word = key.replace('map:', '');
    const values = await client.lRange(key, 0, -1);
    const total = values.reduce((acc, val) => acc + Number(val), 0);

    console.log(`${word}: ${total}`);
    results[word] = total; // Armazena a contagem total
  }

  console.log(`Reducer ${reducerId} finalizado.`);

  const outputDir = path.join(__dirname, 'reducer-output');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputFilePath = path.join(outputDir, `reducer_${reducerId}_output.txt`);
  fs.writeFileSync(outputFilePath, JSON.stringify(results, null, 2));

  await client.quit();
}

main().catch(err => {
  console.error('Erro no reducer:', err);
  process.exit(1);
});
