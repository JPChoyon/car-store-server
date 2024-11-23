import { Router } from 'express';
import { CarController } from './car.controller';

const carRouter = Router();

// creating car data
carRouter.post('/', CarController.createCarInDB);
carRouter.get('/', CarController.findAllCar);
carRouter.get('/:carId', CarController.findACar);
carRouter.put('/:carId', CarController.updateACar);
carRouter.delete('/:carId', CarController.deleteACar);

export default carRouter;
