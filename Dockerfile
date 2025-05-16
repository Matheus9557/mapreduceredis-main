# Imagem base oficial do Node.js
FROM node:20

# Diretório de trabalho dentro do container
WORKDIR /app

# Copia apenas os arquivos necessários para instalar dependências
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante dos arquivos da aplicação
COPY . .

# Comando padrão (sobrescrito via docker-compose)
CMD ["node", "coordinator.js"]
