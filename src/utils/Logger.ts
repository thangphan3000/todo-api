import winston from 'winston';

const { combine, colorize, timestamp, json, errors, cli } = winston.format;
const { Console } = winston.transports;

export class LoggerStream {
  write(message: string) {
    const data = JSON.parse(message);
    logger.http('incoming-request', data);
  }
}

const isDevelopment = process.env.NODE_ENV === 'development';
const tags = { development: 'local', staging: 'staging', uat: 'uat', production: 'prod' };

const prettyConsoleTransport = new Console({
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
  transports: [isDevelopment ? prettyConsoleTransport : new Console()],
  defaultMeta: { app: 'NodeJS', env: tags[process.env.NODE_ENV || 'development'] }
});

export default logger;
