const morgan  = require('morgan');
const winston = require('winston');
const fs      = require('fs');
const path    = require('path');

const LOG_DIR    = 'logs';
const ACCESS_LOG = path.join(__dirname, LOG_DIR, 'access.log');
const ERROR_LOG  = path.join(LOG_DIR, 'erros.log');
const APP_LOG    = path.join(LOG_DIR, 'app.log');

const logStream = fs.createWriteStream(ACCESS_LOG, { flags: 'a' });

const loggerRequisicoes = morgan('combined', { stream: logStream });

const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.Console({ level: 'info'}),
    new winston.transports.File({level: 'error', filename: ERROR_LOG}),
    new winston.transports.File({filename: APP_LOG}),
  ]  
});

module.exports = {
  loggerRequisicoes,
  logger
};