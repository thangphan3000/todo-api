import express, { Request, Response } from 'express';
import * as dotenv from 'dotenv';
import promClient from 'prom-client';
import log from './Logger';

dotenv.config();

const METRICS_SERVER_PORT = Number(process.env.METRICS_SERVER_PORT) || 9000;

const app = express();

export const responseTimeHistogram = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status']
});

export function startMetricsServer() {
  promClient.register.setDefaultLabels({
    app: 'nodejs-api'
  });

  promClient.collectDefaultMetrics();

  app.get('/metrics', async (_req: Request, res: Response) => {
    const metrics = await promClient.register.metrics();

    res.set('Content-Type', promClient.register.contentType).send(metrics);
  });

  app.listen(METRICS_SERVER_PORT, () => {
    log.info(`Metrics server started at port: ${METRICS_SERVER_PORT}`);
  });
}
