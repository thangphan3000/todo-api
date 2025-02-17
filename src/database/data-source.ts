import * as dotenv from 'dotenv';
import path from 'path';

import { DataSource } from 'typeorm';

dotenv.config();

const isDevelopment = process.env.NODE_ENV === 'development';

const getEntityFilesPathBasedOnENV = (): string => {
  if (isDevelopment) {
    return 'src/entities/*.{js,ts}';
  }

  return `${path.resolve(__dirname, '..')}/entities/*.{js,ts}`;
};

const getMigrationFilesBasedOnENV = (): string => {
  if (isDevelopment) {
    return 'src/database/migrations/*.ts';
  }

  return `${path.resolve(__dirname, '..')}/database/migrations/*.js`;
};

const entitiesPath = getEntityFilesPathBasedOnENV();
const migrationsPath = getMigrationFilesBasedOnENV();

export const AppDataSource = new DataSource({
  type: 'mysql',
  replication: {
    master: {
      host: process.env.DB_HOST_SOURCE,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    },
    slaves: [
      {
        host: process.env.DB_HOST_REPLICA,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
      }
    ],
    canRetry: true,
    removeNodeErrorCount: 5,
    selector: 'RR'
  },
  logging: isDevelopment,
  migrations: [migrationsPath],
  entities: [entitiesPath],
  synchronize: false,
  subscribers: []
});
