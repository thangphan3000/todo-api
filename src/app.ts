import bodyParser from 'body-parser';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import { ErrorHandler } from './utils/ErrorHandler';
import todosRoutes from './routes/todos';
import healthRoutes from './routes/health';
import { responseTimeHistogram } from './utils/Metrics';

const app = express();

// Middlewares
app.use(cors({ origin: process.env.WEB_URL }));
app.use(bodyParser.json());
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = process.hrtime();

  res.on('finish', () => {
    const duration = process.hrtime(start);
    const durationInSeconds = duration[0] + duration[1] / 1e9;

    responseTimeHistogram.observe(
      {
        method: req.method,
        route: req.originalUrl,
        status: res.statusCode
      },
      durationInSeconds
    );
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
