import type { Request, Response, NextFunction } from 'express';
import { PacienteService } from '../services/paciente.service.js';
import { ApiResponse } from '../utils/response.js';

export const obtenerEjerciciosRecomendados = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const paciente_id = req.params.paciente_id as string;
    const data = await PacienteService.obtenerEjerciciosRecomendados(paciente_id);
    return ApiResponse.success(res, 'Ejercicios recomendados', data);
  } catch (error) {
    next(error);
  }
};