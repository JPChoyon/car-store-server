/* eslint-disable @typescript-eslint/no-explicit-any */
import { IOrder } from './order.interface';
import { orderModel } from './order.model';
import { orderUtils } from './order.utils';

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
const findOrdersByUserEmail = async (email?: string) => {
  try {
    const query = email ? { email } : {};
    const orders = await orderModel.find(query).populate('car');
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

interface VerifiedPayment {
  sp_code: string;
  transaction_status: string;
  method: string;
  date_time: string;
  sp_message: string;
  bank_status: string;
}
const verifyPayment = async (order_id: string): Promise<VerifiedPayment[]> => {
  const verifiedPayment: VerifiedPayment[] = (await orderUtils.verifyPayment(
    order_id,
  )) as VerifiedPayment[];

  if (verifiedPayment.length > 0) {
    await orderModel.findOneAndUpdate(
      {
        'transaction.id': order_id,
      },
      {
        'transaction.bank_status': verifiedPayment[0].bank_status || 'n/a',
        'transaction.sp_code': verifiedPayment[0].sp_code,
        'transaction.sp_message': verifiedPayment[0].sp_message,
        'transaction.transactionStatus': verifiedPayment[0].transaction_status,
        'transaction.method': verifiedPayment[0].method,
        'transaction.date_time': verifiedPayment[0].date_time,
        status:
          verifiedPayment[0].bank_status == 'Success'
            ? 'Paid'
            : verifiedPayment[0].bank_status == 'Failed'
              ? 'Pending'
              : verifiedPayment[0].bank_status == 'Cancel'
                ? 'Cancelled'
                : '',
      },
    );
  }

  return verifiedPayment;
};

export const orderService = {
  createOrderInDB,
  findOrderInDB,
  findAOrderInDB,
  findOrdersByUserEmail,
  calculateTotalRevenue,
  verifyPayment,
};
