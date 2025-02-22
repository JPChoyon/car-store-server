/* eslint-disable @typescript-eslint/no-explicit-any */
import { IOrder } from './order.interface';
import { orderModel } from './order.model';

// Creating order data
const createOrderInDB = async (order: IOrder) => {
  const result = await orderModel.create(order);
  return result;
};

// Find all order data
const findOrderInDB = async () => {
  const result = await orderModel.find();
  return result;
};

// Find one order by id
const findAOrderInDB = async (id: string) => {
  const result = await orderModel.findById(id);
  return result;
};

// Find orders by user email (no pagination)
const findOrdersByUserEmail = async (email: string) => {
  try {
    const orders = await orderModel.find({ email: email }); // Change `userEmail` if necessary
    return orders;
  } catch (error: any) {
    throw new Error(`Error fetching orders: ${error.message}`);
  }
};

// Calculate total revenue from orders
const calculateTotalRevenue = async (): Promise<number> => {
  try {
    const result = await orderModel.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: { $multiply: ['$totalPrice', '$quantity'] } },
        },
      },
    ]);

    return result[0]?.totalRevenue || 0;
  } catch (error: any) {
    throw new Error(`Failed to calculate revenue: ${error.message}`);
  }
};

export const orderService = {
  createOrderInDB,
  findOrderInDB,
  findAOrderInDB,
  findOrdersByUserEmail,
  calculateTotalRevenue,
};
