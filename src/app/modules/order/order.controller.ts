/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from 'zod';
import { orderService } from './order.service';
import { orderValidator } from './order.validator';
import { Request, Response } from 'express';
import { CarController } from '../car/car.controller';

// insert order data in database
const createOrderInDB = async (req: Request, res: Response) => {
  const { car, quantity } = req.body;
  // Validate input
  if (!car || !quantity || quantity <= 0) {
    res.status(400).json({
      message:
        'Car (carId) and a valid quantity are required in the request body',
      success: false,
    });
  }
  try {
    // Validate the order data with Zod
    const zodData = orderValidator.parse(req.body);
    // Retrieve the car details
    const carData: any = await CarController.findACarForOrder(car);
    // Check inventory quantity
    if (carData.quantity < quantity) {
      res.status(400).json({
        message: 'Insufficient stock for the requested quantity',
        success: false,
      });
    }
    // Calculate new inventory quantity and stock status
    const newQuantity = carData.quantity - quantity;
    const stockStatus = newQuantity > 0;
    // Update the car's inventory in the database
    const updateResponse = await CarController.updateACarForOrder(car, {
      quantity: newQuantity,
      inStock: stockStatus,
    });
    if (!updateResponse) {
      res.status(500).json({
        message: 'Failed to update car inventory',
        success: false,
        data: updateResponse,
      });
    }
    // Create the order in the database
    const orderResult = await orderService.createOrderInDB(zodData);
    res.status(201).json({
      message: 'Order created successfully',
      success: true,
      data: orderResult,
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      // Handle Zod validation errors
      res.status(400).json({
        message: 'Order validation failed',
        success: false,
        errors: err.errors,
      });
    }
    // Handle unexpected errors
    res.status(500).json({
      message: 'Something went wrong',
      success: false,
      error: err.message,
      stack: err.stack, // Include error stack for debugging
    });
  }
};

// find the all order from the database
const findAllOrder = async (req: Request, res: Response) => {
  try {
    const result = await orderService.findOrderInDB();
    res.json({
      message: 'order retrieved successfully',
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
// find the all order from the database
const findAOrder = async (req: Request, res: Response) => {
  const { orderId } = req.params;
  try {
    const result = await orderService.findAOrderInDB(orderId);
    // If no order is found, return 404 response
    if (!result) {
      res.status(404).json({
        message: 'order not found',
        success: false,
      });
    }
    // If a order is found, return the order data
    res.status(200).json({
      message: 'order retrieved successfully',
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
const calculateRevenue = async (req: Request, res: Response) => {
  try {
    const totalRevenue = await orderService.calculateTotalRevenue();
    res.status(200).json({
      message: 'Revenue calculated successfully',
      status: true,
      data: { totalRevenue },
    });
  } catch (error: any) {
    res.status(500).json({
      message: 'Failed to calculate revenue',
      status: false,
      error: error.message,
    });
  }
};

export const orderController = {
  createOrderInDB,
  findAllOrder,
  findAOrder,
  calculateRevenue,
};
