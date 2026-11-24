import { FisioterapeutaRepository } from '../repositories/fisioterapeuta.repository.js';
import { PacienteRepository } from '../repositories/paciente.repository.js';
import { AppError } from '../utils/AppError.js';
import { pool } from '../config/database.js';

export class FisioterapeutaService {
  static async listarPacientesAsignados(usuarioId: string) {
    const fisioterapeutaId = await FisioterapeutaRepository.getFisioterapeutaIdByUsuarioId(usuarioId);
    if (!fisioterapeutaId) {
      throw new AppError('Fisioterapeuta no encontrado', 404);
    }

    return await FisioterapeutaRepository.getPacientesByFisioterapeuta(fisioterapeutaId);
  }

  static async verPatologiaPaciente(pacienteId: string) {
    return await FisioterapeutaRepository.getPatologiasByPaciente(pacienteId);
  }

  static async asignarPatologiaPaciente(pacienteId: string, patologiaIds: string[]) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      await FisioterapeutaRepository.clearPatologiasPaciente(pacienteId, connection);

      if (patologiaIds && patologiaIds.length > 0) {
        const values = patologiaIds.map((id: string) => [pacienteId, id]);
        await FisioterapeutaRepository.insertPatologiasPaciente(values, connection);
      }

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async getFisioterapeutaReporte(usuarioId: string) {
    const fisioterapeutaId = await FisioterapeutaRepository.getFisioterapeutaIdByUsuarioId(usuarioId);
    if (!fisioterapeutaId) {
      throw new AppError('Fisioterapeuta no encontrado', 404);
    }
    return await FisioterapeutaRepository.getFisioterapeutaReporte(fisioterapeutaId);
  }

  static async asignarFasePaciente(pacienteId: string, fase: string) {
    const fasesValidas = ['AGUDA', 'SUBAGUDA', 'FORTALECIMIENTO'];
    if (!fasesValidas.includes(fase)) {
      throw new AppError('Fase de recuperación inválida', 400);
    }
    await PacienteRepository.actualizarFaseRecuperacion(pacienteId, fase);
  }

  static async actualizarDatosClinicos(pacienteId: string, datos: { nivel_dolor: number, comorbilidades: string[], nivel_actividad_fisica: string }) {
    await PacienteRepository.actualizarDatosClinicos(pacienteId, datos);
  }

  static async darAltaPaciente(pacienteId: string) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      // Finalizar cualquier rutina activa
      await connection.query(`UPDATE rutinas SET activa = 0 WHERE paciente_id = ? AND activa = 1`, [pacienteId]);
      
      // Limpiar las patologías asignadas
      await connection.query(`DELETE FROM paciente_patologias WHERE paciente_id = ?`, [pacienteId]);

      // Limpiar los datos clínicos del expediente para dejarlo en blanco para una futura consulta
      await connection.query(`
        UPDATE pacientes 
        SET fase_recuperacion = NULL, 
            nivel_dolor = NULL, 
            comorbilidades = NULL, 
            nivel_actividad_fisica = NULL 
        WHERE id = ?
      `, [pacienteId]);
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}
