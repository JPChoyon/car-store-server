import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

declare module 'express-serve-static-core' {
  interface Request {
    user?: JwtPayload; // Modify this type based on what you store in req.user
  }
}
