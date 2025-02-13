import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { userModel } from '../modules/user/user.model';
import config from '../config';

interface AuthRequest extends Request {
  user?: JwtPayload;
}

const auth = (requiredRole: string) =>
  catchAsync(
    async (
      req: AuthRequest,
      res: Response,
      next: NextFunction,
    ): Promise<void> => {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        res.status(401).json({ error: 'Unauthorized - No Token' });
        return;
      }

      const token = authHeader;
      try {
        const decoded = jwt.verify(
          token,
          config.jwt_secret as string,
        ) as JwtPayload;

        if (!decoded.email || !decoded.role) {
          res.status(403).json({ error: 'Invalid Token' });
          return;
        }

        const user = await userModel.findOne({ email: decoded.email });

        if (!user) {
          res.status(404).json({ error: 'User not found' });
          return;
        }

        if (user.role !== requiredRole) {
          res
            .status(403)
            .json({ error: 'Forbidden - Insufficient permissions' });
          return;
        }

        req.user = decoded; 
        next();
      } catch (err) {
        res.status(401).json({ error: 'Invalid or Expired Token' });
      }
    },
  );

export default auth;
