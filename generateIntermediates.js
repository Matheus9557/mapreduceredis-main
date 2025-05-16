const fs = require('fs');
const path = require('path');

// Garantir que o diretório "intermediates" exista
const intermediatesDir = path.join(__dirname, 'intermediates');
if (!fs.existsSync(intermediatesDir)) {
  fs.mkdirSync(intermediatesDir);
}

// Gerar arquivos intermediários de exemplo
for (let i = 0; i < 10; i++) {
  const intermediateFilePath = path.join(intermediatesDir, `intermediate${i}.json`);
  const intermediateContent = {
    chunk: `chunk${i}.txt`,
    data: [`exemplo de dado ${i}`, `outra linha de dado ${i}`],
  };
  fs.writeFileSync(intermediateFilePath, JSON.stringify(intermediateContent, null, 2));
}

console.log('Arquivos intermediários gerados com sucesso!');
