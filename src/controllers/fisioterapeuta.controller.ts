import type { Request, Response, NextFunction } from 'express';
import { FisioterapeutaService } from '../services/fisioterapeuta.service.js';
import { ApiResponse } from '../utils/response.js';

export const listarPacientesAsignados = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const usuarioId = (req as any).user.id;
    const pacientes = await FisioterapeutaService.listarPacientesAsignados(usuarioId);
    return ApiResponse.success(res, 'Pacientes listados con éxito', { pacientes });
  } catch (error) {
    next(error);
  }
};

export const verPatologiaPaciente = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { paciente_id } = req.params;
    const patologias = await FisioterapeutaService.verPatologiaPaciente(Number(paciente_id));
    return ApiResponse.success(res, 'Patologías obtenidas con éxito', patologias);
  } catch (error) {
    next(error);
  }
};

export const asignarPatologiaPaciente = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { paciente_id } = req.params;
    const { patologia_ids } = req.body;
    await FisioterapeutaService.asignarPatologiaPaciente(Number(paciente_id), patologia_ids);
    
    const message = (patologia_ids && patologia_ids.length > 0) 
      ? 'Patología(s) asignada(s) correctamente al paciente.' 
      : 'Se eliminaron las patologías del paciente.';
      
    return ApiResponse.success(res, message);
  } catch (error) {
    next(error);
  }
};

export const obtenerReporte = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const usuarioId = (req as any).user.id;
    const rep = await FisioterapeutaService.getFisioterapeutaReporte(usuarioId);
    return ApiResponse.success(res, 'Reporte obtenido con éxito', rep);
  } catch (error) {
    next(error);
  }
};

export const asignarFasePaciente = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { paciente_id } = req.params;
    const { fase_recuperacion } = req.body;
    await FisioterapeutaService.asignarFasePaciente(Number(paciente_id), fase_recuperacion);
    return ApiResponse.success(res, 'Fase de recuperación actualizada con éxito');
  } catch (error) {
    next(error);
  }
};