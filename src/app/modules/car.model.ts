import { model, Schema } from 'mongoose';
import { TCar } from './car.interface';

// car schema for validation car data insert
const carSchema = new Schema<TCar>(
  {
    brand: { type: String, enum: ['Toyota', 'BMW', 'Ford'], require: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    price: { type: Number, required: true },
    category: {
      type: String,
      enum: ['Sedan', 'SUV', 'Truck', 'Coupe', 'Convertible'],
      required: true,
    },
    description: { type: String, required: true },
    quantity: { type: Number, required: true },
    inStock: { type: Boolean, required: true },
  },
  // times laps added for update and create
  {
    timestamps: true,
  },
);

export const CarModel = model<TCar>('Car', carSchema);


