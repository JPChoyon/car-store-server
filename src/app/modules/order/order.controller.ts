/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from 'zod';
import { orderService } from './order.service';
import { orderValidator } from './order.validator';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import { CarController } from '../car/car.controller';
import { orderUtils } from './order.utils';
import catchAsync from '../../utils/catchAsync';
import { orderModel } from './order.model';
interface IQuery {
  email?: string;
}
// insert order data in database
const createOrderInDB = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const { car, quantity, email } = req.body;

  // Validate input
  if (!car || !quantity || quantity <= 0 || !email) {
    return res.status(400).json({
      message: 'Email, Car (carId), and a valid quantity are required',
      success: false,
    });
  }

  try {
    // Retrieve the car details
    const carData: any = await CarController.findACarForOrder(car);
    if (!carData || !carData.quantity || !carData.price) {
      return res.status(404).json({
        message: 'Car not found or invalid',
        success: false,
      });
    }

    // Check inventory quantity
    if (carData.quantity < quantity) {
      return res.status(400).json({
        message: 'Insufficient stock for the requested quantity',
        success: false,
      });
    }

    // Calculate total price
    const totalPrice = carData.price * quantity;
    const orderData = { email, car, quantity, totalPrice };

    // Validate the order data with Zod
    const validatedOrder = orderValidator.parse(orderData);

    // Update inventory
    const newQuantity = carData.quantity - quantity;
    const stockStatus = newQuantity > 0;

    const updateResponse = await CarController.updateACarForOrder(car, {
      quantity: newQuantity,
      inStock: stockStatus,
    });

    if (!updateResponse) {
      return res.status(500).json({
        message: 'Failed to update car inventory',
        success: false,
      });
    }
    const orderResult = await orderService.createOrderInDB(validatedOrder);

    // Prepare payment payload
    const shurjoPayPayload = {
      amount: orderResult.totalPrice,
      order_id: orderResult._id,
      currency: 'BDT',
      customer_name: orderResult.email,
      customer_address: 'Bangladesh',
      customer_phone: '0123456789',
      customer_city: 'Dhaka',
      client_ip: '192.168.0.256',
    };

    //  make payment
    let paymentResponse;
    try {
      paymentResponse = await orderUtils.makePayment(shurjoPayPayload);

      // If payment is successful, update the order with transaction details
      if (paymentResponse?.transactionStatus) {
        await orderModel.updateOne(
          { _id: orderResult._id },
          {
            transaction: {
              id: paymentResponse.sp_order_id,
              transactionStatus: paymentResponse.transactionStatus,
            },
          },
        );
      }
    } catch (paymentError) {
      // Explicitly typecast `paymentError`
      const errorMessage = (paymentError as Error).message;
      paymentResponse = { error: errorMessage };
    }

    // ✅ Send a single response with order & payment info
    return res.status(201).json({
      message: 'Order processed',
      success: true,
      order: orderResult,
      payment: paymentResponse,
    });
  } catch (error) {
    next(error);
  }
};

// In your findAllOrder controller
const findAllOrder: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { email } = req.query;
    let result;
    if (email) {
      result = await orderService.findOrdersByUserEmail(email as string);
    } else {
      result = await orderService.findOrderInDB();
    }
    if (!result || result.length === 0) {
      res.status(404).json({
        message: 'No orders found.',
        success: false,
      });
      return;
    }
    res.json({
      message: 'Orders retrieved successfully',
      success: true,
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      message: 'Something went wrong',
      success: false,
      error: err.message,
      stack: err.stack,
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
const verifyPayment = catchAsync(async (req, res) => {
  const order = await orderService.verifyPayment(req.query.order_id as string);
  res.status(201).json({
    message: 'Order verified successfully',
    status: true,
    data: order,
  });
});

export const orderController = {
  createOrderInDB,
  findAOrder,
  calculateRevenue,
  findAllOrder,
  verifyPayment,
};
