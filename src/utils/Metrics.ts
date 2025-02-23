import express, { Request, Response } from 'express';
import * as dotenv from 'dotenv';
import client from 'prom-client';
import log from './Logger';

dotenv.config();

const METRICS_SERVER_PORT = Number(process.env.METRICS_SERVER_PORT) || 9000;

const app = express();

export function startMetricsServer() {
  const collectDefaultMetrics = client.collectDefaultMetrics;
  collectDefaultMetrics();

  app.get('/metrics', async (req: Request, res: Response) => {
    const metrics = await client.register.metrics();

    res.set('Content-Type', client.register.contentType).send(metrics);
  });

  app.listen(METRICS_SERVER_PORT, () => {
    log.info(`Metrics server started at port: ${METRICS_SERVER_PORT}`);
  });
}
