import type { Request, Response, NextFunction } from 'express';
import { AdminService } from '../services/admin.service.js';
import { ApiResponse } from '../utils/response.js';

export const asignarPaciente = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { pacienteIds, fisioterapeutaId } = req.body;
    await AdminService.asginarPaciente(pacienteIds, fisioterapeutaId);
    return ApiResponse.success(res, 'Pacientes asignados correctamente');
  } catch (error) {
    next(error);
  }
};

export const listarFisioterapeutas = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await AdminService.listarFisioterapeutas();
    return ApiResponse.success(res, 'Lista de fisioterapeutas obtenida', data);
  } catch (error) {
    next(error);
  }
};

export const actualizarFisioterapeuta = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await AdminService.actualizarFisioterapeuta(Number(id), req.body);
    return ApiResponse.success(res, 'Fisioterapeuta actualizado exitosamente');
  } catch (error) {
    next(error);
  }
};

export const eliminarFisioterapeuta = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await AdminService.eliminarFisioterapeuta(Number(id));
    return ApiResponse.success(res, 'Fisioterapeuta dado de baja correctamente');
  } catch (error) {
    next(error);
  }
};

export const listarPacientes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await AdminService.listarPacientes();
    return ApiResponse.success(res, 'Lista de pacientes obtenida', data);
  } catch (error) {
    next(error);
  }
};

export const actualizarPaciente = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await AdminService.actualizarPaciente(Number(id), req.body);
    return ApiResponse.success(res, 'Paciente actualizado exitosamente');
  } catch (error) {
    next(error);
  }
};

export const eliminarPaciente = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await AdminService.eliminarPaciente(Number(id));
    return ApiResponse.success(res, 'Paciente dado de baja correctamente');
  } catch (error) {
    next(error);
  }
};

export const reporteGeneral = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const fechaInicio = req.query.fechaInicio as string;
    const fechaFin = req.query.fechaFin as string;
    const data = await AdminService.reporteGeneral(fechaInicio, fechaFin);
    return ApiResponse.success(res, 'Reporte general obtenido', data);
  } catch (error) {
    next(error);
  }
};

export const listarPacientesInactivos = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await AdminService.listarPacientesInactivos();
    return ApiResponse.success(res, 'Lista de pacientes inactivos obtenida', data);
  } catch (error) {
    next(error);
  }
};

export const reactivarPaciente = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await AdminService.reactivarPaciente(Number(id));
    return ApiResponse.success(res, 'Paciente reactivado exitosamente');
  } catch (error) {
    next(error);
  }
};