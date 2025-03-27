import winston from 'winston';

const { combine, colorize, timestamp, json, errors, cli } = winston.format;
const { File, Console } = winston.transports;
const LOGS_FOLDER_PATH = 'logs/';

export class LoggerStream {
  write(message: string) {
    const data = JSON.parse(message);
    logger.http('incoming-request', data);
  }
}

const tags = { development: 'local', staging: 'staging', uat: 'uat', production: 'prod' };

const consoleTransport = new Console({
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
  level: process.env.LOG_LEVEL || 'http',
  exitOnError: false,
  format: combine(timestamp(), errors({ stack: true }), json()),
  transports: [new File({ filename: `${LOGS_FOLDER_PATH}/standards.log` }), consoleTransport],
  exceptionHandlers: [new File({ filename: `${LOGS_FOLDER_PATH}/exceptions.log` })],
  rejectionHandlers: [new File({ filename: `${LOGS_FOLDER_PATH}/rejections.log` })],
  defaultMeta: { app: 'NodeJS', env: tags[process.env.NODE_ENV || 'development'] }
});

export default logger;
