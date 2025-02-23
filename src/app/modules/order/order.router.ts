import { Router } from 'express';
import { orderController } from './order.controller';



const orderRouter = Router();

orderRouter.post('/', orderController.createOrderInDB);
orderRouter.get('/', orderController.findAllOrder);
orderRouter.get('/verify', orderController.verifyPayment);
orderRouter.get('/revenue', orderController.calculateRevenue);
orderRouter.get('/:orderId', orderController.findAOrder);

export default orderRouter;
