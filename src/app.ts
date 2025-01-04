import bodyParser from "body-parser";
import cors from "cors";
import express, { Request, Response } from "express";
import { ErrorHandler } from "./utils/ErrorHandler";
import todosRoutes from "./routes/todos";

const app = express();

app.use(cors({ origin: process.env.FRONT_HOST }));
app.use(bodyParser.json());

app.use("/api/todos", ErrorHandler.handleError(todosRoutes));

app.all(/(.*)/, (req: Request, res: Response) => {
  res.status(404).send({
    success: false,
    message: "not found",
  });
});

export default app;
