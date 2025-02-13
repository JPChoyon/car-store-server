import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { userModel } from '../modules/user/user.model';
import config from '../config';

const auth = (requiredRole: string) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      // Check if token is provided
      if (!authHeader) {
        return res.status(401).json({ error: 'Unauthorized - No Token' });
      }
      const token = authHeader
      // Verify token
      const decoded = jwt.verify(
        token,
        config.jwt_secret as string,
      ) as JwtPayload;
      if (!decoded.email || !decoded.role) {
        return res.status(403).json({ error: 'Invalid Token' });
      }

      // Find the user in the database
      const user = await userModel.findOne({ email: decoded.email });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Role validation
      if (user.role !== requiredRole) {
        return res
          .status(403)
          .json({ error: 'Forbidden - Insufficient permissions' });
      }

      // Attach user to request
      req.user = user;
      next();
    } catch (err) {
      return res.status(401).json({ error: 'Invalid or Expired Token' });
    }
  });
};

export default auth;
