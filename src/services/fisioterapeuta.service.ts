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
}
