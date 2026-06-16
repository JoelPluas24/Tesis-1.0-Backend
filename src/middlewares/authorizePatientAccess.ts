import type { Request, Response, NextFunction } from 'express';
import { pool } from '../config/database.js';
import { AppError } from '../utils/AppError.js';
import { UserRole } from '../types/roles.js';

export const authorizePatientAccess = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    if (!user) {
      return next(new AppError('No autenticado', 401));
    }

    // Si es ADMIN, tiene acceso total
    if (user.rol === UserRole.ADMIN) {
      return next();
    }

    let pacienteIdRaw = req.params.paciente_id || req.body?.paciente_id;

    // Si no hay paciente_id directo, pero hay un id de rutina en los params (para PUT/DELETE/GET de rutinas)
    if (!pacienteIdRaw && req.params.id) {
      const [rutinaRows]: any = await pool.query(
        'SELECT paciente_id, fisioterapeuta_id FROM rutinas WHERE id = ?',
        [Number(req.params.id)]
      );
      if (rutinaRows.length === 0) {
        return next(new AppError('Rutina no encontrada', 404));
      }
      
      // Si el rol es FISIOTERAPEUTA, verificar que sea el creador de la rutina o esté asignado al paciente
      if (user.rol === UserRole.FISIOTERAPEUTA && rutinaRows[0].fisioterapeuta_id !== user.id) {
        return next(new AppError('No tienes permisos para acceder o modificar esta rutina', 403));
      }
      
      pacienteIdRaw = rutinaRows[0].paciente_id;
    }

    if (!pacienteIdRaw) {
      return next(new AppError('ID de paciente requerido', 400));
    }

    const pacienteId = Number(pacienteIdRaw);
    if (isNaN(pacienteId)) {
      return next(new AppError('ID de paciente inválido', 400));
    }

    if (user.rol === UserRole.PACIENTE) {
      // Verificar si este usuario es el paciente solicitado
      const [rows]: any = await pool.query(
        'SELECT id FROM pacientes WHERE usuario_id = ? AND id = ?',
        [user.id, pacienteId]
      );
      if (rows.length === 0) {
        return next(new AppError('No tienes permisos para acceder a los datos de este paciente', 403));
      }
      return next();
    }

    if (user.rol === UserRole.FISIOTERAPEUTA) {
      // Verificar si este fisioterapeuta tiene asignado al paciente
      const [fisioRows]: any = await pool.query(
        'SELECT id FROM fisioterapeutas WHERE usuario_id = ?',
        [user.id]
      );
      if (fisioRows.length === 0) {
        return next(new AppError('Fisioterapeuta no encontrado', 404));
      }
      const fisioId = fisioRows[0].id;

      // Verificar asignación
      const [pacienteRows]: any = await pool.query(
        'SELECT id FROM pacientes WHERE id = ? AND fisioterapeuta_id = ?',
        [pacienteId, fisioId]
      );
      if (pacienteRows.length === 0) {
        return next(new AppError('No tienes asignado a este paciente', 403));
      }
      return next();
    }

    return next(new AppError('Rol no autorizado para esta acción', 403));
  } catch (error) {
    next(error);
  }
};
