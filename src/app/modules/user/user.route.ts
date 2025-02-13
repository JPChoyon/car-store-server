import { Router } from 'express';
import orderRouter from '../order/order.router';
import { orderController } from '../order/order.controller';


const userRouter = Router();

orderRouter.get('/', orderController.findAllOrder);
orderRouter.post('/', orderController.createOrderInDB);
orderRouter.get('/revenue', orderController.calculateRevenue);
orderRouter.get('/:orderId', orderController.findAOrder);

export default userRouter;
