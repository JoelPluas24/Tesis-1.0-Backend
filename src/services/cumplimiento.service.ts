import { CumplimientoRepository } from '../repositories/cumplimiento.repository.js';
import { AppError } from '../utils/AppError.js';
import { socketService } from './socket.service.js';
import { pool } from '../config/database.js';

export class CumplimientoService {
  static async registrarCumplimiento(ejercicioId: string, usuarioId: string, fecha: string) {
    const pacienteId = await CumplimientoRepository.getPacienteIdByUsuarioId(usuarioId);
    if (!pacienteId) {
      throw new AppError('Paciente no encontrado', 404);
    }

    // Lógica Alta Médica
    let altaMedica = false;
    const rutina = await CumplimientoRepository.getRutinaActivaConFechas(pacienteId);
    
    if (!rutina) {
        throw new AppError('No hay una rutina activa para este paciente', 400);
    }
    
    const { id: rutinaId, fecha_inicio, fecha_fin } = rutina;

    const yaCompletado = false; // El frontend controla la cantidad de registros permitidos al día.
    /*
    const yaCompletado = await CumplimientoRepository.checkEjercicioCompletedToday(pacienteId, ejercicioId, rutinaId);
    if (yaCompletado) {
      return { yaCompletado: true, altaMedica: false };
    }
    */

    await CumplimientoRepository.addCumplimiento(pacienteId, ejercicioId, rutinaId, fecha);

    if (rutina) {
      const totalEjercicios = await CumplimientoRepository.countEjerciciosRutina(rutinaId);
      
      const totalTareasEsperadas = totalEjercicios * (rutina.total_sesiones || 10);
      
      // Contar cuántos cumplimientos totales ha hecho en ese rango de fechas
      const realizados = await CumplimientoRepository.countTotalCumplimientosRutina(pacienteId, rutinaId, fecha_inicio, fecha_fin);

      const porcentajeCumplimiento = totalTareasEsperadas > 0
        ? Math.min(100, Math.round((realizados / totalTareasEsperadas) * 100))
        : 0;

      if (porcentajeCumplimiento >= 100) {
        // En lugar de dar alta automática, solo notificamos al fisioterapeuta
        // altaMedica = true; // Se elimina el alta automática
        // await CumplimientoRepository.deactivateUsuario(usuarioId);
        // await CumplimientoRepository.unassignFisioterapeuta(pacienteId);
        // await CumplimientoRepository.deactivateRutina(rutinaId);

        // Notificación 3: Notificar al admin y fisioterapeuta que el paciente completó su plan
        try {
          // Obtener nombre del paciente
          const [pacData]: any = await pool.query(
            `SELECT u.nombres, u.apellidos, p.fisioterapeuta_id 
             FROM pacientes p INNER JOIN usuarios u ON p.usuario_id = u.id 
             WHERE p.id = ?`, [pacienteId]
          );
          const nombrePaciente = pacData[0] ? `${pacData[0].nombres} ${pacData[0].apellidos}` : 'Un paciente';
          const fisioId = pacData[0]?.fisioterapeuta_id;

          const notifData = {
            titulo: 'Plan Completado',
            mensaje: `${nombrePaciente} ha completado el 100% de su plan de ejercicios. Revise su progreso para considerar darle de Alta.`,
            fecha: new Date().toISOString()
          };

          // Notificar a todos los admins
          const [admins]: any = await pool.query(`SELECT id FROM usuarios WHERE rol = 'ADMIN' AND activo = 1`);
          for (const admin of admins) {
            socketService.notifyUser(admin.id, 'nueva-notificacion', notifData);
          }

          // Notificar al fisioterapeuta asignado
          if (fisioId) {
            const [fisioData]: any = await pool.query(
              `SELECT usuario_id FROM fisioterapeutas WHERE id = ?`, [fisioId]
            );
            if (fisioData[0]?.usuario_id) {
              socketService.notifyUser(fisioData[0].usuario_id, 'nueva-notificacion', notifData);
            }
          }
        } catch (e) {
          // No bloquear la operación si la notificación falla
        }
      }
    }

    return { yaCompletado: false, altaMedica };
  }

  static async verProgresoPaciente(pacienteId: string) {
    const rutina = await CumplimientoRepository.getRutinaActivaConFechas(pacienteId);

    if (!rutina) {
      return {
        paciente_id: pacienteId,
        progreso: [],
        total_ejercicios: 0,
        ejercicios_realizados: 0,
        porcentaje_cumplimiento: 0
      };
    }

    const { id: rutinaId, fecha_inicio, fecha_fin } = rutina;
    const progreso = await CumplimientoRepository.getProgresoResumen(pacienteId, rutinaId, fecha_inicio, fecha_fin);
    
    const totalEjercicios = await CumplimientoRepository.countEjerciciosRutina(rutinaId);
    
    const totalTareasEsperadas = totalEjercicios * (rutina.total_sesiones || 10);
    const realizados = await CumplimientoRepository.countTotalCumplimientosRutina(pacienteId, rutinaId, fecha_inicio, fecha_fin);

    const porcentajeCumplimiento = totalTareasEsperadas > 0
      ? Math.min(100, Math.round((realizados / totalTareasEsperadas) * 100))
      : 0;

    return {
      paciente_id: pacienteId,
      progreso,
      total_ejercicios: totalTareasEsperadas,
      ejercicios_realizados: realizados,
      porcentaje_cumplimiento: porcentajeCumplimiento,
      fecha_inicio,
      fecha_fin,
      total_dias: (rutina.total_sesiones || 10) // Mantenemos el nombre total_dias para compatibilidad del frontend
    };
  }

  static async obtenerHistorialDiario(pacienteId: string) {
    const historial = await CumplimientoRepository.getHistorialDiario(pacienteId);
    return historial;
  }
}
