import { pool } from '../config/database.js';

export class CumplimientoRepository {
  static async getPacienteIdByUsuarioId(usuarioId: string) {
    const [rows]: any = await pool.query(
      `SELECT id FROM pacientes WHERE usuario_id = ?`,
      [usuarioId]
    );
    return rows[0]?.id;
  }

  static async checkEjercicioCompletedToday(pacienteId: string, ejercicioId: string, rutinaId: string) {
    const [rows]: any = await pool.query(
      `SELECT id FROM cumplimiento_ejercicios 
       WHERE paciente_id = ? AND ejercicio_id = ? AND rutina_id = ? AND fecha = CURDATE()`,
      [pacienteId, ejercicioId, rutinaId]
    );
    return rows.length > 0;
  }

  static async addCumplimiento(pacienteId: string, ejercicioId: string, rutinaId: string, fecha: string) {
    await pool.query(
      `INSERT INTO cumplimiento_ejercicios 
       (paciente_id, ejercicio_id, rutina_id, fecha, completado)
       VALUES (?, ?, ?, ?, 1)`,
      [pacienteId, ejercicioId, rutinaId, fecha]
    );
  }

  static async getRutinaActivaConFechas(pacienteId: string) {
    const [rows]: any = await pool.query(
      `SELECT id, fecha_inicio, fecha_fin, total_sesiones FROM rutinas WHERE paciente_id = ? AND activa = 1`,
      [pacienteId]
    );
    return rows[0] || null;
  }

  static async getRutinaActivaId(pacienteId: string) {
    const row = await this.getRutinaActivaConFechas(pacienteId);
    return row?.id;
  }

  static async countEjerciciosRutina(rutinaId: string) {
    const [rows]: any = await pool.query(
      `SELECT COUNT(*) as total FROM rutina_ejercicios WHERE rutina_id = ?`,
      [rutinaId]
    );
    return rows[0]?.total || 0;
  }

  static async countTotalCumplimientosRutina(pacienteId: string, rutinaId: string, fechaInicio: any, fechaFin: any) {
    const fInicio = fechaInicio instanceof Date 
      ? new Intl.DateTimeFormat('sv-SE', { timeZone: 'America/Guayaquil' }).format(fechaInicio)
      : (typeof fechaInicio === 'string' ? fechaInicio.split('T')[0] : fechaInicio);
    const fFin = fechaFin instanceof Date
      ? new Intl.DateTimeFormat('sv-SE', { timeZone: 'America/Guayaquil' }).format(fechaFin)
      : (typeof fechaFin === 'string' ? fechaFin.split('T')[0] : fechaFin);

    const [rows]: any = await pool.query(
      `SELECT COUNT(c.id) as realizados
       FROM cumplimiento_ejercicios c
       WHERE c.paciente_id = ? AND c.rutina_id = ? AND c.fecha BETWEEN ? AND ?`,
      [pacienteId, rutinaId, fInicio, fFin]
    );
    return rows[0]?.realizados || 0;
  }

  static async countDistintosEjerciciosRealizados(pacienteId: string, rutinaId: string) {
    const [rows]: any = await pool.query(
      `SELECT COUNT(DISTINCT c.ejercicio_id) as realizados
       FROM cumplimiento_ejercicios c
       WHERE c.paciente_id = ? AND c.rutina_id = ?`,
      [pacienteId, rutinaId]
    );
    return rows[0]?.realizados || 0;
  }

  static async deactivateUsuario(usuarioId: string) {
    await pool.query(`UPDATE usuarios SET activo = 0 WHERE id = ?`, [usuarioId]);
  }

  static async unassignFisioterapeuta(pacienteId: string) {
    await pool.query(`UPDATE pacientes SET fisioterapeuta_id = NULL WHERE id = ?`, [pacienteId]);
  }

  static async deactivateRutina(rutinaId: string) {
    await pool.query(`UPDATE rutinas SET activa = 0 WHERE id = ?`, [rutinaId]);
  }

  static async getProgresoResumen(pacienteId: string, rutinaId?: string, fechaInicio?: any, fechaFin?: any) {
    let query = `SELECT 
        e.nombre,
        COUNT(c.id) AS veces_realizado
       FROM cumplimiento_ejercicios c
       INNER JOIN ejercicios e ON c.ejercicio_id = e.id
       WHERE c.paciente_id = ?`;
    const params: any[] = [pacienteId];

    if (rutinaId && fechaInicio && fechaFin) {
      const fInicio = fechaInicio instanceof Date 
        ? new Intl.DateTimeFormat('sv-SE', { timeZone: 'America/Guayaquil' }).format(fechaInicio)
        : (typeof fechaInicio === 'string' ? fechaInicio.split('T')[0] : fechaInicio);
      const fFin = fechaFin instanceof Date
        ? new Intl.DateTimeFormat('sv-SE', { timeZone: 'America/Guayaquil' }).format(fechaFin)
        : (typeof fechaFin === 'string' ? fechaFin.split('T')[0] : fechaFin);

      query = `SELECT 
        e.nombre,
        COUNT(c.id) AS veces_realizado
       FROM cumplimiento_ejercicios c
       INNER JOIN ejercicios e ON c.ejercicio_id = e.id
       WHERE c.paciente_id = ? AND c.rutina_id = ? AND c.fecha BETWEEN ? AND ?`;
      params.push(rutinaId, fInicio, fFin);
    }

    query += ` GROUP BY e.nombre`;

    const [rows]: any = await pool.query(query, params);
    return rows;
  }

  static async getHistorialDiario(pacienteId: string) {
    const [rows]: any = await pool.query(
      `SELECT 
        c.fecha, 
        COUNT(c.id) as cantidad_ejercicios,
        GROUP_CONCAT(DISTINCT e.nombre SEPARATOR ', ') as nombres_ejercicios,
        c.rutina_id,
        p.nombre as patologia_nombre
       FROM cumplimiento_ejercicios c
       INNER JOIN ejercicios e ON c.ejercicio_id = e.id
       LEFT JOIN rutinas r ON c.rutina_id = r.id
       LEFT JOIN patologias p ON r.patologia_id = p.id
       WHERE c.paciente_id = ?
       GROUP BY c.fecha, c.rutina_id, p.nombre
       ORDER BY c.fecha DESC`,
      [pacienteId]
    );
    return rows;
  }
}
