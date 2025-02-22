import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { userValidator } from '../user/user.validator';
import { z } from 'zod';
import { AuthValidation } from './auth.validator';

const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userData = req.body;
    // Validate the data with zod
    const zodData = userValidator.parse(userData);
    const existingUser = await AuthService.findUserByEmail(zodData.email);
    if (existingUser) {
      return res.status(400).json({
        message: 'Email is already registered',
        success: false,
      });
    }
    const result = await AuthService.registerUser(zodData);
    res.status(200).json({
      message: 'User registered successfully',
      success: true,
      data: result,
    });
  } catch (err: any) {
    next(err); 
  }
};


const login = async (req: Request, res: Response) => {
  const userData = req.body;
  try {
    // data validation with zod
    const zodData = AuthValidation.loginValidator.parse(userData);
    const result = await AuthService.loginUser(zodData);
    res.status(200).json({
      message: 'User Logged in successfully',
      success: true,
      data: result,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      // Handle Zod validation errors
      res.status(400).json({
        message: 'User validation failed',
        success: false,
        errors: err.errors,
      });
    } else {
      res.status(500).json({
        message: 'User validation failed',
        success: false,
        error: err,
        stack: err.stack, //error stack shown here as the requirement
      });
    }
  }
};
export const AuthController = {
  register,
  login,
};
