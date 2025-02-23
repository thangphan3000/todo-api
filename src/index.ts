/* eslint-disable no-console */
import * as dotenv from 'dotenv';
import 'reflect-metadata';
import app from './app';
import { AppDataSource } from './database/data-source';
import log from './utils/Logger';
import { startMetricsServer } from './utils/Metrics';

dotenv.config();

const PORT = Number(process.env.APP_PORT) || 3000;

AppDataSource.initialize()
  .then(async () => {
    log.info('Database connection success');
  })
  .catch((err) => console.log(err));

app.listen(PORT, () => {
  log.info(`Server is listening on the port: ${PORT}`);
});

startMetricsServer();
