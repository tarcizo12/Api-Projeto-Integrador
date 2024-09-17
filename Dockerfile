# Use uma imagem oficial do Node.js como base
FROM node:20.17.0

# Defina o diretório de trabalho dentro do container
WORKDIR /app

# Copie o arquivo package.json e package-lock.json (se houver)
COPY package*.json ./

# Instale o 'npm-check-updates' globalmente para ajudar a atualizar dependências
RUN npm install -g npm-check-updates

# Atualize as dependências para as versões mais recentes
RUN npx npm-check-updates -u && npm install

# Remover @types/dotenv, já que o dotenv fornece seus próprios tipos
RUN npm uninstall @types/dotenv

# Copie o restante do código para o diretório de trabalho
COPY . .

# Compile o código TypeScript
RUN npm run build

# Exponha a porta em que a aplicação vai rodar
EXPOSE 3000

# Comando para rodar a aplicação
CMD ["npm", "start"]
