import express, { Request, Response } from 'express';
import cors from 'cors';
import carRouter from './app/modules/car/car.router';
import orderRouter from './app/modules/order/order.router';
import userRouter from './app/modules/user/user.route';
import authRoute from './app/modules/auth/auth.route';
const app = express();

// parser / middleware
app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoute);
app.use('/api/user', userRouter);
app.use('/api/cars', carRouter);
app.use('/api/orders', orderRouter);
const getAController = (req: Request, res: Response) => {
  res.send('Car store server is running');
};

app.get('/', getAController);
export default app;
