import { pool } from '../config/database.js';

export class CumplimientoRepository {
  static async getPacienteIdByUsuarioId(usuarioId: number) {
    const [rows]: any = await pool.query(
      `SELECT id FROM pacientes WHERE usuario_id = ?`,
      [usuarioId]
    );
    return rows[0]?.id;
  }

  static async checkEjercicioCompletedToday(pacienteId: number, ejercicioId: number) {
    const [rows]: any = await pool.query(
      `SELECT id FROM cumplimiento_ejercicios 
       WHERE paciente_id = ? AND ejercicio_id = ? AND fecha = CURDATE()`,
      [pacienteId, ejercicioId]
    );
    return rows.length > 0;
  }

  static async addCumplimiento(pacienteId: number, ejercicioId: number, fecha: string) {
    await pool.query(
      `INSERT INTO cumplimiento_ejercicios 
       (paciente_id, ejercicio_id, fecha, completado)
       VALUES (?, ?, ?, 1)`,
      [pacienteId, ejercicioId, fecha]
    );
  }

  static async getRutinaActivaConFechas(pacienteId: number) {
    const [rows]: any = await pool.query(
      `SELECT id, fecha_inicio, fecha_fin FROM rutinas WHERE paciente_id = ? AND activa = 1`,
      [pacienteId]
    );
    return rows[0] || null;
  }

  static async getRutinaActivaId(pacienteId: number) {
    const row = await this.getRutinaActivaConFechas(pacienteId);
    return row?.id;
  }

  static async countEjerciciosRutina(rutinaId: number) {
    const [rows]: any = await pool.query(
      `SELECT COUNT(*) as total FROM rutina_ejercicios WHERE rutina_id = ?`,
      [rutinaId]
    );
    return rows[0]?.total || 0;
  }

  static async countTotalCumplimientosRutina(pacienteId: number, rutinaId: number, fechaInicio: any, fechaFin: any) {
    const fInicio = fechaInicio instanceof Date 
      ? new Intl.DateTimeFormat('sv-SE', { timeZone: 'America/Guayaquil' }).format(fechaInicio)
      : (typeof fechaInicio === 'string' ? fechaInicio.split('T')[0] : fechaInicio);
    const fFin = fechaFin instanceof Date
      ? new Intl.DateTimeFormat('sv-SE', { timeZone: 'America/Guayaquil' }).format(fechaFin)
      : (typeof fechaFin === 'string' ? fechaFin.split('T')[0] : fechaFin);

    const [rows]: any = await pool.query(
      `SELECT COUNT(c.id) as realizados
       FROM cumplimiento_ejercicios c
       INNER JOIN rutina_ejercicios re ON c.ejercicio_id = re.ejercicio_id
       WHERE c.paciente_id = ? AND re.rutina_id = ? AND c.fecha BETWEEN ? AND ?`,
      [pacienteId, rutinaId, fInicio, fFin]
    );
    return rows[0]?.realizados || 0;
  }

  static async countDistintosEjerciciosRealizados(pacienteId: number, rutinaId: number) {
    const [rows]: any = await pool.query(
      `SELECT COUNT(DISTINCT c.ejercicio_id) as realizados
       FROM cumplimiento_ejercicios c
       INNER JOIN rutina_ejercicios re ON c.ejercicio_id = re.ejercicio_id
       WHERE c.paciente_id = ? AND re.rutina_id = ?`,
      [pacienteId, rutinaId]
    );
    return rows[0]?.realizados || 0;
  }

  static async deactivateUsuario(usuarioId: number) {
    await pool.query(`UPDATE usuarios SET activo = 0 WHERE id = ?`, [usuarioId]);
  }

  static async unassignFisioterapeuta(pacienteId: number) {
    await pool.query(`UPDATE pacientes SET fisioterapeuta_id = NULL WHERE id = ?`, [pacienteId]);
  }

  static async deactivateRutina(rutinaId: number) {
    await pool.query(`UPDATE rutinas SET activa = 0 WHERE id = ?`, [rutinaId]);
  }

  static async getProgresoResumen(pacienteId: number) {
    const [rows]: any = await pool.query(
      `SELECT 
        e.nombre,
        COUNT(c.id) AS veces_realizado
       FROM cumplimiento_ejercicios c
       INNER JOIN ejercicios e ON c.ejercicio_id = e.id
       WHERE c.paciente_id = ?
       GROUP BY e.nombre`,
      [pacienteId]
    );
    return rows;
  }

  static async getHistorialDiario(pacienteId: number) {
    const [rows]: any = await pool.query(
      `SELECT 
        c.fecha, 
        COUNT(c.id) as cantidad_ejercicios,
        r.id as rutina_id,
        p.nombre as patologia_nombre
       FROM cumplimiento_ejercicios c
       INNER JOIN rutina_ejercicios re ON c.ejercicio_id = re.ejercicio_id
       INNER JOIN rutinas r ON re.rutina_id = r.id
       LEFT JOIN patologias p ON r.patologia_id = p.id
       WHERE c.paciente_id = ? AND r.paciente_id = ?
       GROUP BY c.fecha, r.id, p.nombre
       ORDER BY c.fecha DESC`,
      [pacienteId, pacienteId]
    );
    return rows;
  }
}
