import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError.js';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next(new AppError('Token requerido', 401));
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return next(new AppError('Token expirado', 401));
      }
      return next(new AppError('Token inválido', 403));
    }

    (req as any).user = user;
    next();
  });
};