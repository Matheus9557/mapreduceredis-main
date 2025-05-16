const fs = require('fs');
const path = require('path');

// Garantir que o diretório "chunks" exista
const chunksDir = path.join(__dirname, 'chunks');
if (!fs.existsSync(chunksDir)) {
  fs.mkdirSync(chunksDir);
}

// Gerar arquivos de entrada para os mappers
for (let i = 0; i < 10; i++) {
  const chunkFilePath = path.join(chunksDir, `chunk${i}.txt`);
  const chunkContent = `Conteúdo de exemplo para o arquivo chunk${i}.\nLinhas de dados de entrada para o Mapper ${i}.`;
  fs.writeFileSync(chunkFilePath, chunkContent);
}

console.log('Arquivos chunk gerados com sucesso!');
