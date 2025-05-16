const fs = require('fs');
const path = require('path');

// Garantir que o diretório "outputs" exista
const outputsDir = path.join(__dirname, 'outputs');
if (!fs.existsSync(outputsDir)) {
  fs.mkdirSync(outputsDir);
}

// Gerar arquivo de saída para os reducers (output.txt)
const outputPath = path.join(outputsDir, 'output.txt');
const outputContent = 'Resultado final do processo MapReduce.\nSaída do reducer com dados agregados.';
fs.writeFileSync(outputPath, outputContent);

console.log('Arquivo de saída do reducer gerado com sucesso!');
