import type { Request, Response, NextFunction } from 'express';
import { EjercicioService } from '../services/ejercicio.service.js';
import { ApiResponse } from '../utils/response.js';

export const crearEjercicio = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = await EjercicioService.crearEjercicio(req.body);
    return ApiResponse.success(res, 'Ejercicio creado correctamente', { id }, 201);
  } catch (error) {
    next(error);
  }
};

export const asociarEjercicioPatologia = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { patologia_id, ejercicios_ids } = req.body;
    await EjercicioService.asociarEjercicioPatologia(patologia_id, ejercicios_ids);
    
    const message = (ejercicios_ids && ejercicios_ids.length > 0)
      ? 'Ejercicios asociados correctamente a la patología'
      : 'Asociaciones actualizadas (vacío)';
      
    return ApiResponse.success(res, message, null, 201);
  } catch (error) {
    next(error);
  }
};

export const obtenerEjercicios = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await EjercicioService.obtenerEjercicios();
    return ApiResponse.success(res, 'Lista de ejercicios obtenida', data);
  } catch (error) {
    next(error);
  }
};

export const obtenerEjercicioPorId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ejercicioId = req.params.id as string;
    const data = await EjercicioService.obtenerEjercicioPorId(ejercicioId);
    return ApiResponse.success(res, 'Ejercicio obtenido', data);
  } catch (error) {
    next(error);
  }
};

export const actualizarEjercicio = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ejercicioId = req.params.id as string;
    await EjercicioService.actualizarEjercicio(ejercicioId, req.body);
    return ApiResponse.success(res, 'Ejercicio actualizado correctamente');
  } catch (error) {
    next(error);
  }
};

export const eliminarEjercicio = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ejercicioId = req.params.id as string;
    await EjercicioService.eliminarEjercicio(ejercicioId);
    return ApiResponse.success(res, 'Ejercicio eliminado correctamente');
  } catch (error) {
    next(error);
  }
};
