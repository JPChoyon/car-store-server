import express, { Request, Response } from 'express';
import cors from 'cors';
import carRouter from './app/modules/car/car.router';
const app = express();

// parser / middleware
app.use(express.json());
app.use(cors());
app.use('/api/cars', carRouter);
const getAController = (req: Request, res: Response) => {
  res.send('Car store server is running');
};

app.get('/', getAController);
export default app;
