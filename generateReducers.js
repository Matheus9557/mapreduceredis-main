const fs = require('fs');
const path = require('path');

// Garantir que o diretório "reducers" exista
const reducersDir = path.join(__dirname, 'reducers');
if (!fs.existsSync(reducersDir)) {
  fs.mkdirSync(reducersDir);
}

// Gerar arquivo de entrada para os reducers (input.json)
const reducerInputPath = path.join(reducersDir, 'input.json');
const reducerInputContent = [
  { key: 'exemplo1', values: ['valor1', 'valor2'] },
  { key: 'exemplo2', values: ['valor3', 'valor4'] },
];
fs.writeFileSync(reducerInputPath, JSON.stringify(reducerInputContent, null, 2));

console.log('Arquivo de entrada para o reducer gerado com sucesso!');
