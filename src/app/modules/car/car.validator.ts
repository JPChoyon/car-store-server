import { z } from 'zod';

export const carValidationSchema = z.object({
  brand: z.enum(['Toyota', 'BMW', 'Ford'], {
    required_error: 'Brand is required',
    invalid_type_error: 'Brand must be one of: Toyota, BMW, Ford',
  }),
  model: z.enum(['Camry', '3 Series', 'Focus'], {
    required_error: 'Model is required',
    invalid_type_error: 'Model must be one of: Camry, 3 Series, Focus',
  }),
  year: z
    .number({
      required_error: 'Year is required',
      invalid_type_error: 'Year must be a valid number',
    })
    .int('Year must be an integer')
    .min(1886, 'Year must be no earlier than 1886') 
    .max(new Date().getFullYear(), ` Year cannot be in the future`), 
  price: z
    .number({
      required_error: 'Price is required',
      invalid_type_error: 'Price must be a valid number',
    })
    .positive('Price must be a positive number'), 
  category: z.enum(['Sedan', 'SUV', 'Truck', 'Coupe', 'Convertible'], {
    required_error: 'Category is required',
    invalid_type_error:
      'Category must be one of: Sedan, SUV, Truck, Coupe, Convertible',
  }),
  description: z.string({
    required_error: 'Description is required',
    invalid_type_error: 'Description must be a string',
  }),
  quantity: z
    .number({
      required_error: 'Quantity is required',
      invalid_type_error: 'Quantity must be a valid number',
    })
    .int('Quantity must be an integer')
    .positive('Quantity must be a positive number'),
  inStock: z.boolean({
    required_error: 'InStock is required',
    invalid_type_error: 'InStock must be a boolean',
  }),
});
