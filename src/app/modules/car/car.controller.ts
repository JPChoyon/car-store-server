/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { CarServices } from './car.service';
import { carValidationSchema } from './car.validator';
import { z } from 'zod';

// insert car data in database
const createCarInDB = async (req: Request, res: Response) => {
  const carData = req.body;

  try {
    // data validation with zod
    const zodData = carValidationSchema.parse(carData);
    const result = await CarServices.createCarInDB(zodData);
    res.status(200).json({
      message: 'Car created successfully',
      success: true,
      data: result,
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      // Handle Zod validation errors
      res.status(400).json({
        message: 'Car validation failed',
        success: false,
        errors: err.errors,
      });
    } else {
      res.status(500).json({
        message: 'Car validation failed',
        success: false,
        error: err,
        stack: err.stack, //error stack shown here as the requirement
      });
    }
  }
};
// find the all car from the database
const findAllCar = async (req: Request, res: Response) => {
  try {
    const { searchParams } = req.query;

    let filter = {};
    if (searchParams) {
      const searchRegex = new RegExp(searchParams as string, 'i'); // Case-insensitive
      filter = {
        $or: [
          { brand: searchRegex },
          { model: searchRegex },
          { category: searchRegex },
        ],
      };
    }

    // Query the database with the constructed filter
    const result = await CarServices.findCarInDB(filter);
    res.json({
      message: 'Cars retrieved successfully',
      success: true,
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      message: 'Something Went Wrong',
      success: false,
      error: err.message,
      stack: err.stack, // Include error stack for debugging
    });
  }
};

// find the a car from the database
const findACar = async (req: Request, res: Response) => {
  const { carId } = req.params;
  try {
    const result = await CarServices.findACarInDB(carId);
    // If no car is found, return 404 response
    if (!result) {
      res.status(404).json({
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

// delete car data
const deleteACar = async (req: Request, res: Response) => {
  const { carId } = req.params;
  try {
    await CarServices.deleteCarInDB(carId);
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
// find car data for order
const findACarForOrder = async (car: string, res?: Response) => {
  try {
    // Query the database directly using the string ID
    const result = await CarServices.findACarInDBForOrder(car);
    if (!result) {
      if (res) {
        res.json({
          message: 'Car not found ',
          success: false,
        });
      }
    } else {
      return result;
    }
  } catch (err: any) {
    if (res) {
      res.json({
        message: 'Something Went Wrong',
        success: false,
        error: err,
        stack: err.stack, // error stack shown here as the requirement
      });
    }
    throw new Error(`Error finding car for order: ${err.message}`);
  }
};
// update car data after order
const updateACarForOrder = async (
  car: string,
  bodyData: object,
  res?: Response,
) => {
  try {
    // Query the database directly using the string ID
    const result = await CarServices.updateACarInDBForOrder(car, bodyData);
    // Handle no result
    if (!result) {
      const errorResponse = {
        message: 'Car not found',
        success: false,
      };
      if (res) {
        return res.json(errorResponse);
      }
      return errorResponse;
    }

    // Handle success
    const successResponse = {
      message: 'Car retrieved successfully',
      success: true,
      data: result,
    };
    if (res) {
      return res.json(successResponse);
    }
    return successResponse;
  } catch (err: any) {
    const errorResponse = {
      message: 'Something went wrong',
      success: false,
      error: err.message,
      stack: err.stack,
    };
    if (res) {
      return res.json(errorResponse);
    }
    throw err;
  }
};
export const CarController = {
  createCarInDB,
  findAllCar,
  findACar,
  updateACar,
  deleteACar,
  findACarForOrder,
  updateACarForOrder,
};
