import { CumplimientoRepository } from '../repositories/cumplimiento.repository.js';
import { AppError } from '../utils/AppError.js';
import { socketService } from './socket.service.js';
import { pool } from '../config/database.js';

export class CumplimientoService {
  static async registrarCumplimiento(ejercicioId: number, usuarioId: number, fecha: string) {
    const pacienteId = await CumplimientoRepository.getPacienteIdByUsuarioId(usuarioId);
    if (!pacienteId) {
      throw new AppError('Paciente no encontrado', 404);
    }

    const yaCompletado = false; // El frontend controla la cantidad de registros permitidos al día.
    /*
    const yaCompletado = await CumplimientoRepository.checkEjercicioCompletedToday(pacienteId, ejercicioId);
    if (yaCompletado) {
      return { yaCompletado: true, altaMedica: false };
    }
    */

    await CumplimientoRepository.addCumplimiento(pacienteId, ejercicioId, fecha);

    // Lógica Alta Médica
    let altaMedica = false;
    const rutina = await CumplimientoRepository.getRutinaActivaConFechas(pacienteId);

    if (rutina) {
      const { id: rutinaId, fecha_inicio, fecha_fin } = rutina;
      const totalEjercicios = await CumplimientoRepository.countEjerciciosRutina(rutinaId);
      
      const fi = new Date(fecha_inicio);
      const ff = new Date(fecha_fin);
      const diffTime = Math.abs(ff.getTime() - fi.getTime());
      const totalDias = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      
      const totalTareasEsperadas = totalEjercicios * totalDias;
      
      // Contar cuántos cumplimientos totales ha hecho en ese rango de fechas
      const realizados = await CumplimientoRepository.countTotalCumplimientosRutina(pacienteId, rutinaId, fecha_inicio, fecha_fin);

      const porcentajeCumplimiento = totalTareasEsperadas > 0
        ? Math.min(100, Math.round((realizados / totalTareasEsperadas) * 100))
        : 0;

      if (porcentajeCumplimiento >= 100) {
        altaMedica = true;
        await CumplimientoRepository.deactivateUsuario(usuarioId);
        await CumplimientoRepository.unassignFisioterapeuta(pacienteId);
        await CumplimientoRepository.deactivateRutina(rutinaId);

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
            titulo: 'Alta Médica',
            mensaje: `${nombrePaciente} ha completado todos sus ejercicios y puede ser dado de alta.`,
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

  static async verProgresoPaciente(pacienteId: number) {
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
    const progreso = await CumplimientoRepository.getProgresoResumen(pacienteId);
    
    const totalEjercicios = await CumplimientoRepository.countEjerciciosRutina(rutinaId);
    
    const fi = new Date(fecha_inicio);
    const ff = new Date(fecha_fin);
    const diffTime = Math.abs(ff.getTime() - fi.getTime());
    const totalDias = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    
    const totalTareasEsperadas = totalEjercicios * totalDias;
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
      total_dias: totalDias
    };
  }

  static async obtenerHistorialDiario(pacienteId: number) {
    const historial = await CumplimientoRepository.getHistorialDiario(pacienteId);
    return historial;
  }
}
