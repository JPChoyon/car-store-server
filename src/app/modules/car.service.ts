import { TCar } from './car.interface';
import { CarModel } from './car.model';

// insert car data into database
const createCarInDB = async (car: TCar) => {
  const result = await CarModel.create(car);
  return result;
};

// get all car data
const findCarInDB = async () => {
  const result = await CarModel.find();
  return result;
};

// find one car by id
const findACarInDB = async (id: string) => {
  const result = await CarModel.findById(id);
  return result;
};

// update car data with id
const updateCarInDB = async (id: string, data: TCar) => {
  const result = await CarModel.findByIdAndUpdate(id, data);
  return result;
};
// delete car data with id
const deleteCarInDB = async (id: string) => {
  const result = await CarModel.findByIdAndDelete(id);
  return result;
};

export const CarServices = {
  createCarInDB,
  findCarInDB,
  findACarInDB,
  updateCarInDB,
  deleteCarInDB,
};