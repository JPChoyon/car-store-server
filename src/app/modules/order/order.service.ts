/* eslint-disable @typescript-eslint/no-explicit-any */
import { IOrder, } from './order.interface';
import { orderModel } from './order.model';

// creating order data
const createOrderInDB = async (order: IOrder) => {
  const result = await orderModel.create(order);
  return result;
};

// find all order data
const findOrderInDB = async () => {
  const result = await orderModel.find();
  return result;
};

// find one order by id
const findAOrderInDB = async (id: string) => {
  const result = await orderModel.findById(id);
  return result;
};

const calculateTotalRevenue = async (): Promise<number> => {
  try {
    const result = await orderModel.aggregate([
      {
        $group: {
          _id: null, // Ignore grouping
          totalRevenue: { $sum: { $multiply: ['$totalPrice', '$quantity'] } },
        },
      },
    ]);

    return result[0]?.totalRevenue || 0; // Return totalRevenue or 0 if no orders
  } catch (error:any) {
    throw new Error(`Failed to calculate revenue: ${error.message}`);
  }
};

export const orderService = {
  createOrderInDB,
  findOrderInDB,
  findAOrderInDB,
  calculateTotalRevenue,
};
