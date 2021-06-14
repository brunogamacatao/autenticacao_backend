// Lê os dados do arquivo .env
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const {loggerRequisicoes, logger} = require('./logging');
const db = require('./db');

// criando a aplicação
const app = express();

// configuração da aplicação
app.use(loggerRequisicoes); // ligando o logging da aplicação
app.use(cors()); // permitindo requisições de outros hosts
app.use(express.json()); // aceitando objetos javascript
app.use(express.urlencoded()); // aceitando formulários html

// rotas da aplicação
app.get('/', (req, res) => {
  logger.info('Hello World');
  res.send('Hello World');
});

app.use('/login', require('./controllers/login_controller'));
app.use('/usuarios', require('./controllers/usuario_controller'));
app.use('/filmes', require('./controllers/filme_controller'));

// 1. Conecta ao banco de dados
db.conecta(() => {
  const SERVER_PORT = parseInt(process.env.SERVER_PORT);
  // 2. Inicia o servidor web
  app.listen(SERVER_PORT, () => {
    console.log(`Servidor rodando em http://localhost:${SERVER_PORT}`);
  });
});
