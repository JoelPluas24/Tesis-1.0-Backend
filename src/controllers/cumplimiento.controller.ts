import type { Request, Response, NextFunction } from 'express';
import { CumplimientoService } from '../services/cumplimiento.service.js';
import { ApiResponse } from '../utils/response.js';

export const registrarCumplimiento = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { ejercicio_id, fecha_local } = req.body;
    const usuario_id = (req as any).user.id;
    
    // Si no viene fecha_local, usamos la fecha de hoy.
    const fecha = fecha_local || new Date().toISOString().split('T')[0];
    
    const { yaCompletado, altaMedica } = await CumplimientoService.registrarCumplimiento(ejercicio_id, usuario_id, fecha);

    if (yaCompletado) {
      return ApiResponse.success(res, 'El ejercicio ya fue completado hoy', { altaMedica: false }, 200);
    }

    return ApiResponse.success(res, 'Cumplimiento registrado correctamente', { altaMedica }, 201);
  } catch (error) {
    next(error);
  }
};

export const verProgresoPaciente = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { paciente_id } = req.params;
    const progreso = await CumplimientoService.verProgresoPaciente(Number(paciente_id));
    return ApiResponse.success(res, 'Progreso del paciente', progreso);
  } catch (error) {
    next(error);
  }
};

export const verHistorialPaciente = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { paciente_id } = req.params;
    const historial = await CumplimientoService.obtenerHistorialDiario(Number(paciente_id));
    return ApiResponse.success(res, 'Historial diario del paciente', historial);
  } catch (error) {
    next(error);
  }
};
