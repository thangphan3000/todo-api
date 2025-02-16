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

const entitiesPath = getEntityFilesPathBasedOnENV();

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
  // BUG: fix this path because after we build the source code we do not have the src folder
  migrations: ['src/database/migrations/*.{js,ts}'],
  logging: isDevelopment,
  entities: [entitiesPath],
  synchronize: false,
  subscribers: []
});
