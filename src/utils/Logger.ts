import winston from 'winston';
const { combine, timestamp, json, errors } = winston.format;

const LOGS_FOLDER_PATH = 'logs/';

const transports = [
  new winston.transports.File({ filename: `${LOGS_FOLDER_PATH}/standards.log` }),
  ...(process.env.NODE_ENV === 'development' ? [new winston.transports.Console()] : [])
];

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(timestamp(), errors({ stack: true }), json()),
  transports,
  exceptionHandlers: [new winston.transports.File({ filename: `${LOGS_FOLDER_PATH}/exceptions.log` })],
  rejectionHandlers: [new winston.transports.File({ filename: `${LOGS_FOLDER_PATH}/rejections.log` })],
  defaultMeta: { app: 'nodejs' }
});

export default logger;
