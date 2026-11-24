import type { Request, Response, NextFunction } from 'express';
import { RutinaService } from '../services/rutina.service.js';
import { ApiResponse } from '../utils/response.js';

export const crearRutina = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const fisioterapeuta_id = (req as any).user.id;
    const rutinaId = await RutinaService.crearRutina(req.body, fisioterapeuta_id);
    return ApiResponse.success(res, 'Rutina creada correctamente', { rutina_id: rutinaId }, 201);
  } catch (error) {
    next(error);
  }
};

export const obtenerRutinaActiva = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const paciente_id = req.params.paciente_id as string;
    const data = await RutinaService.obtenerRutinaActiva(paciente_id);
    return ApiResponse.success(res, 'Rutina activa obtenida', data);
  } catch (error) {
    next(error);
  }
};

export const obtenerTodosLosEjerciciosPaciente = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const paciente_id = req.params.paciente_id as string;
    const { fecha_local } = req.query;
    const data = await RutinaService.obtenerTodosLosEjerciciosPaciente(paciente_id, fecha_local as string);
    return ApiResponse.success(res, 'Ejercicios del paciente obtenidos', data);
  } catch (error) {
    next(error);
  }
};

export const obtenerHistorialRutinas = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const paciente_id = req.params.paciente_id as string;
    const data = await RutinaService.obtenerHistorialRutinas(paciente_id);
    return ApiResponse.success(res, 'Historial de rutinas obtenido', data);
  } catch (error) {
    next(error);
  }
};

export const obtenerEjerciciosPorRutina = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const data = await RutinaService.obtenerEjerciciosPorRutina(id);
    return ApiResponse.success(res, 'Ejercicios de la rutina obtenidos', data);
  } catch (error) {
    next(error);
  }
};

export const editarRutina = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    await RutinaService.editarRutina(id, req.body);
    return ApiResponse.success(res, 'Rutina actualizada correctamente', { id });
  } catch (error) {
    next(error);
  }
};

export const finalizarRutina = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    await RutinaService.finalizarRutina(id);
    return ApiResponse.success(res, 'Plan terapéutico finalizado correctamente');
  } catch (error) {
    next(error);
  }
};

export const eliminarRutina = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    await RutinaService.eliminarRutina(id);
    return ApiResponse.success(res, 'Rutina eliminada correctamente');
  } catch (error) {
    next(error);
  }
};