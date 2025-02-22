import { Router } from 'express';
import { orderController } from './order.controller';



const orderRouter = Router();

orderRouter.get('/', orderController.findAllOrder);
orderRouter.post('/', orderController.createOrderInDB);
orderRouter.get('/revenue', orderController.calculateRevenue);
orderRouter.get('/:orderId', orderController.findAOrder);

export default orderRouter;
