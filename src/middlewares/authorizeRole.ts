import type { Request, Response, NextFunction } from 'express';
import { UserRole } from '../types/roles.js';
import { AppError } from '../utils/AppError.js';

export const authorizeRole = (roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user || !roles.includes(user.rol)) {
      return next(new AppError('No tienes permisos para realizar esta acción', 403));
    }
    

    next();
  };
};