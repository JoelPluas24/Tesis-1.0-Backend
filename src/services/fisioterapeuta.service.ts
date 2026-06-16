import { FisioterapeutaRepository } from '../repositories/fisioterapeuta.repository.js';
import { PacienteRepository } from '../repositories/paciente.repository.js';
import { AppError } from '../utils/AppError.js';
import { pool } from '../config/database.js';

export class FisioterapeutaService {
  static async listarPacientesAsignados(usuarioId: number) {
    const fisioterapeutaId = await FisioterapeutaRepository.getFisioterapeutaIdByUsuarioId(usuarioId);
    if (!fisioterapeutaId) {
      throw new AppError('Fisioterapeuta no encontrado', 404);
    }

    return await FisioterapeutaRepository.getPacientesByFisioterapeuta(fisioterapeutaId);
  }

  static async verPatologiaPaciente(pacienteId: number) {
    return await FisioterapeutaRepository.getPatologiasByPaciente(pacienteId);
  }

  static async asignarPatologiaPaciente(pacienteId: number, patologiaIds: number[]) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      await FisioterapeutaRepository.clearPatologiasPaciente(pacienteId, connection);

      if (patologiaIds && patologiaIds.length > 0) {
        const values = patologiaIds.map((id: number) => [pacienteId, id]);
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

  static async getFisioterapeutaReporte(usuarioId: number) {
    const fisioterapeutaId = await FisioterapeutaRepository.getFisioterapeutaIdByUsuarioId(usuarioId);
    if (!fisioterapeutaId) {
      throw new AppError('Fisioterapeuta no encontrado', 404);
    }
    return await FisioterapeutaRepository.getFisioterapeutaReporte(fisioterapeutaId);
  }

  static async asignarFasePaciente(pacienteId: number, fase: string) {
    const fasesValidas = ['AGUDA', 'SUBAGUDA', 'FORTALECIMIENTO'];
    if (!fasesValidas.includes(fase)) {
      throw new AppError('Fase de recuperación inválida', 400);
    }
    await PacienteRepository.actualizarFaseRecuperacion(pacienteId, fase);
  }

  static async actualizarDatosClinicos(pacienteId: number, datos: { nivel_dolor: number, comorbilidades: string[], nivel_actividad_fisica: string }) {
    await PacienteRepository.actualizarDatosClinicos(pacienteId, datos);
  }

  static async darAltaPaciente(pacienteId: number) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      // Finalizar cualquier rutina activa
      await connection.query(`UPDATE rutinas SET activa = 0 WHERE paciente_id = ? AND activa = 1`, [pacienteId]);
      // Quitar la patología activa (si aplica, o simplemente actualizar la fase)
      await connection.query(`UPDATE pacientes SET fase_recuperacion = 'ALTA' WHERE id = ?`, [pacienteId]);
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}
