import type { Request, Response, NextFunction } from 'express';
import { UsersService } from '../services/users.service.js';
import { ApiResponse } from '../utils/response.js';

export const obtenerPerfil = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const data = await UsersService.obtenerPerfil(user.id);
    return ApiResponse.success(res, 'Perfil de usuario obtenido', data);
  } catch (error) {
    next(error);
  }
};

export const cambiarPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return ApiResponse.error(res, 'Las contraseñas actual y nueva son requeridas', 400);
    }
    
    await UsersService.cambiarPassword(user.id, currentPassword, newPassword);
    
    return ApiResponse.success(res, 'Contraseña cambiada correctamente', null);
  } catch (error) {
    next(error);
  }
};