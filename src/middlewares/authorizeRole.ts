import type { Request, Response, NextFunction } from 'express';
import { UserRole } from '../types/roles.js';

export const authorizeRole = (roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user || !roles.includes(user.rol)) {
      return res.status(403).json({
        message: 'No tienes permisos para realizar esta acción'
      });
    }
    

    next();
  };
};