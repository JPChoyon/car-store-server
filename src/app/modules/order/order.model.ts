import mongoose, { model, Schema } from 'mongoose';

const orderSchema = new Schema(
  {
    email: { type: String, required: true },
    car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car' },
    quantity: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
  },
  {
    timestamps: true, // times laps added for update and create
    versionKey: false, //mongoose version disable when data are added
  },
);

export const orderModel = model('order', orderSchema);
