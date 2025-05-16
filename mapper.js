const fs = require('fs');
const readline = require('readline');
const redis = require('redis');

const client = redis.createClient({ url: 'redis://redis:6379' });

async function main() {
  await client.connect();

  const filePath = './input/input.txt';


  const fileStream = fs.createReadStream(filePath);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Exemplo: cada palavra vira uma chave para contagem
    const words = trimmed.split(/\s+/);
    for (const word of words) {
      await client.rPush(`map:${word}`, '1'); // envia '1' para cada ocorrência da palavra
    }
  }

  console.log('Mapper finalizado');
  await client.quit();
}

main().catch((err) => {
  console.error('Erro no mapper:', err);
  process.exit(1);
});
