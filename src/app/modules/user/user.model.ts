import { model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import config from '../../config';

const userSchema = new Schema(
  {
    name: { type: String, require: true },
    email: { type: String, require: true },
    password: { type: String, require: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
  },
  {
    timestamps: true, // times laps added for update and create
    versionKey: false, //mongoose version disable when data are added
  },
);

userSchema.pre('save', async function (next) {
  if (!this.password || typeof this.password !== 'string') {
    throw new Error('Invalid password');
  }

  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_round),
  );

  next();
});
userSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});

export const userModel = model('user', userSchema);
