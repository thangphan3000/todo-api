import winston from 'winston';

const { combine, colorize, timestamp, json, errors, cli } = winston.format;
const LOGS_FOLDER_PATH = 'logs/';

const tags = { development: 'local', staging: 'staging', uat: 'uat', production: 'prod' };

const consoleTransport = new winston.transports.Console({
  format: combine(
    colorize(),
    cli({
      colors: {
        error: 'red',
        warn: 'yellow',
        info: 'blue',
        http: 'green',
        verbose: 'cyan',
        debug: 'white'
      }
    })
  ),
  handleExceptions: true
});

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(timestamp(), errors({ stack: true }), json()),
  transports: [new winston.transports.File({ filename: `${LOGS_FOLDER_PATH}/standards.log` }), consoleTransport],
  exceptionHandlers: [new winston.transports.File({ filename: `${LOGS_FOLDER_PATH}/exceptions.log` })],
  rejectionHandlers: [new winston.transports.File({ filename: `${LOGS_FOLDER_PATH}/rejections.log` })],
  defaultMeta: { app: 'nodejs', env: tags[process.env.NODE_ENV || 'development'] }
});

export default logger;
