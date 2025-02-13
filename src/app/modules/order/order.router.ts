import { Router } from 'express';
import { orderController } from './order.controller';
import auth from '../../middleware/auth';

const orderRouter = Router();

orderRouter.get('/', auth('user'), orderController.findAllOrder);
orderRouter.post('/', orderController.createOrderInDB);
orderRouter.get('/revenue', orderController.calculateRevenue);
orderRouter.get('/:orderId', orderController.findAOrder);

export default orderRouter;
