import express, { Request, Response } from 'express';
import cors from "cors"
const app = express();

// parser / middleware
app.use(express.json());
app.use(cors());
const getAController = (req: Request, res: Response) => {
  res.send('Car store server is running');
};

app.get('/', getAController);
export default app;
