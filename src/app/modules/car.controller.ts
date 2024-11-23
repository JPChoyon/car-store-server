/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { CarServices } from './car.service';

// insert car data in database
const createCarInDB = async (req: Request, res: Response) => {
  try {
    const carData = req.body;
    const result = await CarServices.createCarInDB(carData);
    res.status(200).json({
      message: 'Car created successfully',
      success: true,
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      message: 'Car validation failed',
      success: false,
      error: err,
      stack: err.stack, //error stack shown here as the requirement
    });
  }
};
// find the all car from the database
const findAllCar = async (req: Request, res: Response) => {
  try {
    const result = await CarServices.findCarInDB();
    res.json({
      message: 'Cars retrieved successfully',
      success: true,
      data: result,
    });
  } catch (err: any) {
    res.json({
      message: 'Something Went Wrong',
      success: false,
      error: err,
      stack: err.stack, //error stack shown here as the requirement
    });
  }
};
// find the all car from the database
const findACar = async (req: Request, res: Response) => {
  const { carId } = req.params;
  try {
    const result = await CarServices.findACarInDB(carId);
    // If no car is found, return 404 response
    if (!result) {
      return res.status(404).json({
        message: 'Car not found',
        success: false,
      });
    }
    // If a car is found, return the car data
    res.status(200).json({
      message: 'Car retrieved successfully',
      success: true,
      data: result,
    });
  } catch (err: any) {
    // Return a 500 response for other errors
    res.status(500).json({
      message: 'Something went wrong',
      success: false,
      error: err.message,
      stack: err.stack, // Include the stack trace for debugging
    });
  }
};

// update car data
const updateACar = async (req: Request, res: Response) => {
  const { carId } = req.params;
  const body = req.body;
  try {
    const result = await CarServices.updateCarInDB(carId, body);
    res.json({
      message: 'Car updated successfully',
      success: true,
      data: result,
    });
  } catch (err: any) {
    res.json({
      message: 'Something Went Wrong',
      success: false,
      error: err,
      stack: err.stack, //error stack shown here as the requirement
    });
  }
};

// update car data
const deleteACar = async (req: Request, res: Response) => {
  const { carId } = req.params;
  try {
    const result = await CarServices.deleteCarInDB(carId);
    res.json({
      message: 'Car deleted successfully',
      success: true,
      data: {},
    });
  } catch (err: any) {
    res.json({
      message: 'Something Went Wrong',
      success: false,
      error: err,
      stack: err.stack, //error stack shown here as the requirement
    });
  }
};

export const CarController = {
  createCarInDB,
  findAllCar,
  findACar,
  updateACar,
  deleteACar,
};
