import { AdminRepository } from '../repositories/admin.repository.js';
import { RutinaRepository } from '../repositories/rutina.repository.js';
import { AppError } from '../utils/AppError.js';
import { pool } from '../config/database.js';
import { socketService } from './socket.service.js';

export class AdminService {
  static async asginarPaciente(pacienteIds: number[], fisioterapeutaId: number) {
    if (!Array.isArray(pacienteIds) || pacienteIds.length === 0) {
      throw new AppError('Debe seleccionar al menos un paciente', 400);
    }

    const fisio = await AdminRepository.getFisioterapeutaById(fisioterapeutaId);
    if (!fisio) {
      throw new AppError('Fisioterapeuta no encontrado', 404);
    }

    const asignados = await AdminRepository.getAssignedPacientes(fisioterapeutaId, pacienteIds);
    if (asignados.length > 0) {
      const mismoFisio = asignados.some((p: any) => p.fisioterapeuta_id === Number(fisioterapeutaId));

      if (mismoFisio) {
        const nombres = asignados
          .filter((p: any) => p.fisioterapeuta_id === Number(fisioterapeutaId))
          .map((p: any) => `${p.nombres} ${p.apellidos}`)
          .join(', ');

        throw new AppError(`El paciente (${nombres}) ya ha sido asignado a este fisioterapeuta anteriormente.`, 400);
      }

      throw new AppError('Uno o más pacientes seleccionados ya tienen un fisioterapeuta asignado. Un paciente solo puede estar vinculado a un profesional a la vez.', 400);
    }

    await AdminRepository.assignPacientesToFisioterapeuta(fisioterapeutaId, pacienteIds);

    // Notificación 1: Notificar al fisioterapeuta que se le asignaron pacientes
    try {
      const fisioUsuarioId = fisio.usuario_id;
      if (fisioUsuarioId) {
        socketService.notifyUser(
          fisioUsuarioId,
          'nueva-notificacion',
          {
            titulo: 'Nuevos Pacientes Asignados',
            mensaje: `Se te han asignado ${pacienteIds.length} paciente(s) nuevo(s).`,
            fecha: new Date().toISOString()
          }
        );
      }
    } catch (e) {
      // No bloquear la operación si la notificación falla
    }
  }

  static async listarFisioterapeutas() {
    return await AdminRepository.getFisioterapeutasList();
  }

  static async actualizarFisioterapeuta(id: number, data: any) {
    const { nombres, apellidos, email, especialidad, telefono } = data;
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const usuarioId = await AdminRepository.getFisioterapeutaUserId(id, connection);
      if (!usuarioId) {
        throw new AppError('Fisioterapeuta no encontrado', 404);
      }

      await AdminRepository.updateUsuario(usuarioId, nombres, apellidos, email, connection);
      await AdminRepository.updateFisioterapeuta(id, especialidad, telefono, connection);

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async eliminarFisioterapeuta(id: number) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const usuarioId = await AdminRepository.getFisioterapeutaUserId(id, connection);
      if (!usuarioId) {
        throw new AppError('Fisioterapeuta no encontrado', 404);
      }

      await AdminRepository.removeUsuario(usuarioId, connection);
      await AdminRepository.unassignPatientsFromFisioterapeuta(id, connection);

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async listarPacientes() {
    return await AdminRepository.getPacientesList();
  }

  static async listarPacientesInactivos() {
    return await AdminRepository.getPacientesInactivosList();
  }

  static async actualizarPaciente(id: number, data: any) {
    const { nombres, apellidos, email, edad, genero, direccion } = data;
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const usuarioId = await AdminRepository.getPacienteUserId(id, connection);
      if (!usuarioId) {
        throw new AppError('Paciente no encontrado', 404);
      }

      let mappedGenero = genero;
      if (genero === 'MASCULINO') mappedGenero = 'M';
      if (genero === 'FEMENINO') mappedGenero = 'F';

      await AdminRepository.updateUsuario(usuarioId, nombres, apellidos, email, connection);
      await AdminRepository.updatePaciente(id, edad, mappedGenero, direccion, connection);

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async eliminarPaciente(id: number) {
    const usuarioId = await AdminRepository.getPacienteUserIdWithoutConnection(id);
    if (!usuarioId) {
      throw new AppError('Paciente no encontrado', 404);
    }

    await AdminRepository.removeUsuarioWithoutConnection(usuarioId);
    await AdminRepository.unassignFisioterapeutaFromPaciente(id);
  }

  static async reactivarPaciente(id: number) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const usuarioId = await AdminRepository.getPacienteUserId(id, connection);
      if (!usuarioId) {
        throw new AppError('Paciente no encontrado', 404);
      }

      await AdminRepository.reactivarUsuario(usuarioId, connection);
      await RutinaRepository.deactivateRutinasPrevias(id, connection);

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async reporteGeneral() {
    return await AdminRepository.getGeneralReport();
  }
}
