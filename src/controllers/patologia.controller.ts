import type { Request, Response, NextFunction } from 'express';
import { PatologiaService } from '../services/patologia.service.js';
import { ApiResponse } from '../utils/response.js';

export const crearPatologia = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = await PatologiaService.crearPatologia(req.body);
    return ApiResponse.success(res, 'Patología creada correctamente', { id }, 201);
  } catch (error) {
    next(error);
  }
};

export const obtenerPatologias = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await PatologiaService.obtenerPatologias();
    return ApiResponse.success(res, 'Lista de patologías obtenida', data);
  } catch (error) {
    next(error);
  }
};

export const obtenerEjerciciosPorPatologia = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const data = await PatologiaService.obtenerEjerciciosPorPatologia(Number(id));
    return ApiResponse.success(res, 'Ejercicios de la patología obtenidos', data);
  } catch (error) {
    next(error);
  }
};

export const obtenerPatologiaPorId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const data = await PatologiaService.obtenerPatologiaPorId(Number(id));
    return ApiResponse.success(res, 'Patología obtenida', data);
  } catch (error) {
    next(error);
  }
};

export const actualizarPatologia = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await PatologiaService.actualizarPatologia(Number(id), req.body);
    return ApiResponse.success(res, 'Patología actualizada correctamente');
  } catch (error) {
    next(error);
  }
};

export const eliminarPatologia = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await PatologiaService.eliminarPatologia(Number(id));
    return ApiResponse.success(res, 'Patología eliminada correctamente');
  } catch (error) {
    next(error);
  }
};