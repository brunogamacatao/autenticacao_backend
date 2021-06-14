const mongoose = require('mongoose');
const {logger} = require('../logging');

const conecta = (onConecta) => {
  logger.info('Conectando ao banco de dados ...');
  mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
  const db = mongoose.connection;
  db.on('error', (error) => logger.error(error));
  db.once('open', () => {
    logger.info('Contactado ao banco de dados com sucesso !');
    onConecta && onConecta();
  });
};

module.exports = {
  conecta
};
