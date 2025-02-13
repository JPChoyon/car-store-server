import config from '../../config';
import { TUser } from '../user/user.interface';
import { userModel } from '../user/user.model';
import { TLoginUser } from './auth.interface';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const registerUser = async (payload: TUser) => {
  const result = await userModel.create(payload);
  return result;
};
const loginUser = async (payload: TLoginUser) => {
  const result = await userModel.findOne({ email: payload.email });
  if (!result) {
    throw new Error('User not found');
  }

  // Check for password and compare
  if (!payload.password || !result.password) {
    throw new Error('Password is incorrect or missing');
  }

  const isPasswordMatch = await bcrypt.compare(
    payload.password,
    result.password,
  );

  if (!isPasswordMatch) {
    throw new Error('Password incorrect');
  }

  const token = jwt.sign(
    { email: result.email, role: result.role },
    config.jwt_secret as string,
    { expiresIn: '2d' },
  );

  return { token, result };
};

export const AuthService = {
  registerUser,
  loginUser,
};
