import type { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service.js';
import { ApiResponse } from '../utils/response.js';

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await AuthService.registerUser(req.body);
    return ApiResponse.success(res, 'Usuario creado correctamente', null, 201);
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const data = await AuthService.loginUser(email, password);
    return ApiResponse.success(res, 'Login exitoso', data);
  } catch (error) {
    next(error);
  }
};

export const refreshAccessToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;
    const newAccessToken = await AuthService.refreshAccessToken(refreshToken);
    return ApiResponse.success(res, 'Token renovado', { accessToken: newAccessToken });
  } catch (error) {
    next(error);
  }
};