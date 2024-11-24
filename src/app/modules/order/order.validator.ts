import { z } from 'zod';

export const orderValidator = z.object({
  email: z
    .string({
      required_error: 'Email is required',
      invalid_type_error: 'Email must be a string',
    })
    .email('Invalid email address'),
  car: z
    .string({
      required_error: 'Car is required',
      invalid_type_error: 'Car must be a string',
    })
    .min(1, 'Car name must not be empty'),
  quantity: z
    .number({
      required_error: 'Quantity is required',
      invalid_type_error: 'Quantity must be a number',
    })
    .int('Quantity must be an integer')
    .positive('Quantity must be a positive number'),
  totalPrice: z
    .number({
      required_error: 'Total price is required',
      invalid_type_error: 'Total price must be a number',
    })
    .positive('Total price must be a positive number')
    .min(1, 'Minimum price are 1'),
});
