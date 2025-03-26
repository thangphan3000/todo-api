import * as dotenv from 'dotenv';
import path from 'path';

import { DataSource } from 'typeorm';

dotenv.config();

const isDevelopment = process.env.NODE_ENV === 'development';

const getPaths = () => {
  const baseDir = isDevelopment ? 'src' : path.resolve(__dirname, '..');

  return {
    entities: [`${baseDir}/entities/*.${isDevelopment ? '{js,ts}' : 'js'}`],
    migrations: [`${baseDir}/database/migrations/*.${isDevelopment ? '{js,ts}' : 'js'}`]
  };
};

const getBaseConnection = () => ({
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

const getProductionConfig = () => ({
  replication: {
    master: {
      host: process.env.DB_HOST_SOURCE,
      ...getBaseConnection()
    },
    slaves: [
      {
        host: process.env.DB_HOST_REPLICA,
        ...getBaseConnection()
      }
    ],
    canRetry: true,
    removeNodeErrorCount: 5,
    selector: 'RR' as const
  }
});

const getDevelopmentConfig = () => ({
  host: process.env.DB_HOST_SOURCE,
  ...getBaseConnection()
});

export const AppDataSource = new DataSource({
  type: 'mysql',
  ...(isDevelopment ? getDevelopmentConfig() : getProductionConfig()),
  ...getPaths(),
  logging: isDevelopment,
  synchronize: false,
  subscribers: []
});
