import * as dotenv from 'dotenv';
import 'reflect-metadata';
import app from './app';
import { AppDataSource } from './database/data-source';
import logger from './utils/Logger';
import { startMetricsServer } from './utils/Metrics';

dotenv.config();

const PORT = Number(process.env.APP_PORT) || 3000;

AppDataSource.initialize()
  .then(async () => {
    logger.info('Database connection success');
  })
  .catch((err) => {
    logger.error(err);
  });

app.listen(PORT, () => {
  logger.info(`Server is listening on the port: ${PORT}`);
});

startMetricsServer();
