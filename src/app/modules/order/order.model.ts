import mongoose, { model, Schema } from 'mongoose';

const orderSchema = new Schema(
  {
    email: { type: String, required: true },
    car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car' },
    quantity: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ['Pending', 'Paid', 'Shipped', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
    transaction: {
      id: String,
      transactionStatus: String,
      bank_status: String,
      sp_code: String,
      sp_message: String,
      method: String,
      date_time: String,
    },
  },
  {
    timestamps: true, // times laps added for update and create
    versionKey: false, //mongoose version disable when data are added
  },
);

export const orderModel = model('order', orderSchema);
