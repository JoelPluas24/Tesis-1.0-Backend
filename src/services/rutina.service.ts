import { RutinaRepository } from '../repositories/rutina.repository.js';
import { PacienteRepository } from '../repositories/paciente.repository.js';
import { AppError } from '../utils/AppError.js';
import { pool } from '../config/database.js';
import { OneSignalService } from './onesignal.service.js';
import { socketService } from './socket.service.js';

export class RutinaService {
  static async crearRutina(data: any, fisioterapeutaId: number) {
    const { paciente_id, fecha_inicio, fecha_fin, observaciones, ejercicios } = data;
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      await RutinaRepository.deactivateRutinasPrevias(paciente_id, connection);

      const rutinaId = await RutinaRepository.createRutina(
        { paciente_id, fisioterapeuta_id: fisioterapeutaId, fecha_inicio, fecha_fin, observaciones },
        connection
      );

      await RutinaRepository.addEjerciciosToRutina(rutinaId, ejercicios, connection);

      await connection.commit();
      
      // Enviar notificación al paciente de forma asíncrona
      OneSignalService.sendNotificationToUser(
        paciente_id.toString(),
        'Nueva Rutina Asignada',
        'Tu fisioterapeuta te ha asignado una nueva rutina de ejercicios.'
      );
      
      // Enviar notificación por WebSockets (en tiempo real)
      const paciente = await PacienteRepository.getPacienteById(paciente_id);
      if (paciente && paciente.usuario_id) {
        socketService.notifyUser(
          paciente.usuario_id,
          'nueva-notificacion',
          {
            titulo: 'Nueva Rutina',
            mensaje: 'Se te ha asignado una nueva rutina de ejercicios.',
            fecha: new Date().toISOString()
          }
        );
      }
      
      return rutinaId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async obtenerRutinaActiva(pacienteId: number) {
    const rutina = await RutinaRepository.getRutinaActiva(pacienteId);
    if (!rutina) {
      throw new AppError('No hay rutina activa', 404);
    }

    const ejercicios = await RutinaRepository.getEjerciciosByRutina(rutina.id);
    return { rutina, ejercicios };
  }

  static async obtenerTodosLosEjerciciosPaciente(pacienteId: number, fechaLocal?: string) {
    return await RutinaRepository.getTodosEjerciciosPaciente(pacienteId, fechaLocal);
  }

  static async obtenerHistorialRutinas(pacienteId: number) {
    const historial = await RutinaRepository.getHistorialRutinas(pacienteId);
    return { paciente_id: pacienteId, historial };
  }

  static async obtenerEjerciciosPorRutina(rutinaId: number) {
    return await RutinaRepository.getEjerciciosByRutina(rutinaId);
  }

  static async editarRutina(rutinaId: number, data: any) {
    const { fecha_inicio, fecha_fin, observaciones, ejercicios } = data;
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      await RutinaRepository.updateRutina(rutinaId, { fecha_inicio, fecha_fin, observaciones }, connection);
      
      // Reemplazar ejercicios
      await RutinaRepository.deleteEjerciciosFromRutina(rutinaId, connection);
      if (ejercicios && ejercicios.length > 0) {
        await RutinaRepository.addEjerciciosToRutina(rutinaId, ejercicios, connection);
      }

      await connection.commit();
      return rutinaId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async eliminarRutina(rutinaId: number) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      await RutinaRepository.deleteEjerciciosFromRutina(rutinaId, connection);
      await RutinaRepository.deleteRutina(rutinaId, connection);

      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}
