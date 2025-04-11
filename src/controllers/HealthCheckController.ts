import { Request, Response } from 'express';
import { ResponseUtil } from '../utils/Response';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../database/data-source';
import logger from '../utils/Logger';

export class HealthCheckController {
  async checkHealth(_req: Request, res: Response) {
    try {
      const dataSource: DataSource = AppDataSource;
      if (!dataSource.isInitialized) {
        AppDataSource.initialize()
          .then(async () => {
            logger.info('Database connection success');
          })
          .catch((err) => logger.error(err));
      }

      const readResult = await dataSource.query('SELECT 1 AS read_check');
      if (!readResult || readResult.length === 0) {
        throw new Error('Read health check failed!');
      }
    } catch (err: unknown) {
      logger.error(`Error health check: ${err}`);

      ResponseUtil.sendError({
        res,
        message: 'Internal server error'
      });

      return;
    }

    ResponseUtil.sendResponse({
      res,
      data: null
    });
  }
}
