import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Request, Response } from 'express';
import { ErrorHandler } from './utils/ErrorHandler';
import todosRoutes from './routes/todos';
import healthRoutes from './routes/health';

const app = express();

// Middlewares
app.use(cors({ origin: process.env.WEB_URL }));
app.use(bodyParser.json());

// Routes
app.use('/api/todos', ErrorHandler.handleError(todosRoutes));
app.use('/api/health', ErrorHandler.handleError(healthRoutes));

app.all(/(.*)/, (req: Request, res: Response) => {
  res.status(404).send({
    success: false,
    message: 'not found'
  });
});

export default app;
