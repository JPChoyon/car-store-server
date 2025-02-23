import Shurjopay, { PaymentResponse, VerificationResponse } from 'shurjopay';
import config from '../../config';
import { response } from 'express';
const shurjopay = new Shurjopay();

shurjopay.config(
  config.sp.sp_endpoint!,
  config.sp.sp_username!,
  config.sp.sp_password!,
  config.sp.sp_prefix!,
  config.sp.sp_return_url!,
);
// console.log(shurjopay);
const makePayment = async (paymentPayload: any) => {
  return new Promise((resolve, reject) => {
    shurjopay.makePayment(
      paymentPayload,
      (response) => resolve(response),
      (err) => reject(err),
    );
  });
  // const paymentResult = await shurjopay.makePayment(
  //   paymentPayload,
  //   (response) => {
  //     res.status(201).json({
  //       message: 'Order created successfully',
  //       success: true,
  //       data: response,
  //     });
  //   },
  //   (error) => {
  //     console.log(error);
  //     res
  //       .status(500)
  //       .json({ message: 'Payment failed', success: false, error });
  //   },
  // );
  // return paymentResult;
};
const verifyPayment = (order_id: string) => {
  return new Promise((resolve, reject) => {
    shurjopay.verifyPayment(
      order_id,
      (response) => resolve(response),
      (err) => reject(err),
    );
  });
};
export const orderUtils = {
  makePayment,
  verifyPayment,
};
