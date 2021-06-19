# Imagem base
FROM node:14.16.1-stretch-slim

COPY package.json . 
RUN npm install 
COPY . . 

# Executar a aplicação
CMD node main.js