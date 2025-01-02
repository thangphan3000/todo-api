import bodyParser from "body-parser";
import cors from "cors";
import express, { Request, Response } from "express";

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.all(/(.*)/, (req: Request, res: Response) => {
  res.status(404).send({
    success: false,
    message: "not found",
  });
});

export default app;
