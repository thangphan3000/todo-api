import bodyParser from 'body-parser';
import cors from 'cors';
import { v4 as uuid } from 'uuid';
import express, { NextFunction, Request, Response } from 'express';
import { ErrorHandler } from './utils/ErrorHandler';
import todosRoutes from './routes/todos';
import healthRoutes from './routes/health';
import { requestsInProgress, responseTimeHistogram } from './utils/Metrics';
import morgan from 'morgan';
import { LoggerStream } from './utils/Logger';
import { LoggingRequest } from './types/request';

const app = express();
const morganMiddleware = morgan(
  function (tokens, req, res) {
    return JSON.stringify({
      correlation_id: (req as LoggingRequest).correlation_id,
      method: tokens.method(req, res),
      url: tokens.url(req, res),
      // @ts-expect-error skip type
      status: Number.parseFloat(tokens.status(req, res)),
      // @ts-expect-error skip type
      response_time: Number.parseFloat(tokens['response-time'](req, res)),
      content_length: tokens.res(req, res, 'content-length')
    });
  },
  {
    stream: new LoggerStream()
  }
);

// Middlewares
app.use((req: Request, res: Response, next: NextFunction) => {
  const id = uuid();
  (req as LoggingRequest).correlation_id = id;
  res.setHeader('X-Correlation-Id', id);
  next();
});
app.use(cors({ origin: process.env.WEB_URL }));
app.use(bodyParser.json());
app.use(morganMiddleware);
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = process.hrtime();
  requestsInProgress.inc({ method: req.method, path: req.originalUrl });

  res.on('finish', () => {
    const duration = process.hrtime(start);
    const durationInSeconds = duration[0] + duration[1] / 1e9;

    responseTimeHistogram.observe(
      {
        method: req.method,
        path: req.originalUrl,
        status: res.statusCode
      },
      durationInSeconds
    );
    requestsInProgress.dec({ method: req.method, path: req.originalUrl });
  });

  next();
});

// Routes
app.use('/api/todos', ErrorHandler.handleError(todosRoutes));
app.use('/api/health', ErrorHandler.handleError(healthRoutes));
app.all(/(.*)/, async (_req: Request, res: Response) => {
  res.status(404).send({
    success: false,
    message: 'not found'
  });
});

export default app;
