import { pool } from '../config/database.js';

export class FisioterapeutaRepository {
  static async getFisioterapeutaIdByUsuarioId(usuarioId: number) {
    const [rows]: any = await pool.query(
      `SELECT id FROM fisioterapeutas WHERE usuario_id = ?`,
      [usuarioId]
    );
    return rows[0]?.id;
  }

  static async getPacientesByFisioterapeuta(fisioterapeutaId: number) {
    const [rows]: any = await pool.query(
      `SELECT p.id, u.nombres, u.apellidos, u.email, p.edad, p.genero, p.fase_recuperacion,
              p.nivel_dolor, p.comorbilidades, p.nivel_actividad_fisica,
              (SELECT COUNT(*) > 0 FROM rutinas r WHERE r.paciente_id = p.id AND r.activa = 0) as tiene_historial
       FROM pacientes p
       INNER JOIN usuarios u ON p.usuario_id = u.id
       WHERE p.fisioterapeuta_id = ?`,
      [fisioterapeutaId]
    );
    return rows;
  }

  static async getPatologiasByPaciente(pacienteId: number) {
    const [rows]: any = await pool.query(
      `SELECT p.id, p.nombre, p.descripcion, p.nivel_gravedad 
       FROM patologias p
       INNER JOIN paciente_patologias pp ON p.id = pp.patologia_id
       WHERE pp.paciente_id = ?`,
      [pacienteId]
    );
    return rows;
  }

  static async clearPatologiasPaciente(pacienteId: number, connection: any) {
    await connection.query('DELETE FROM paciente_patologias WHERE paciente_id = ?', [pacienteId]);
  }

  static async insertPatologiasPaciente(values: any[], connection: any) {
    await connection.query(
      `INSERT INTO paciente_patologias (paciente_id, patologia_id) VALUES ?`,
      [values]
    );
  }

  static async getFisioterapeutaReporte(fisioterapeutaId: number) {
    const [pacientes]: any = await pool.query(
      `SELECT COUNT(*) as total FROM pacientes p 
       INNER JOIN usuarios u ON p.usuario_id = u.id 
       WHERE p.fisioterapeuta_id = ? AND u.activo = 1`,
      [fisioterapeutaId]
    );

    const [rutinas]: any = await pool.query(
      `SELECT COUNT(*) as total FROM rutinas r
       INNER JOIN pacientes p ON r.paciente_id = p.id
       WHERE p.fisioterapeuta_id = ? AND r.activa = 1`,
      [fisioterapeutaId]
    );

    const fecha = new Intl.DateTimeFormat('sv-SE', { timeZone: 'America/Guayaquil' }).format(new Date());
    const [adherencia]: any = await pool.query(
      `SELECT COUNT(DISTINCT c.paciente_id) as total 
       FROM cumplimiento_ejercicios c
       INNER JOIN pacientes p ON c.paciente_id = p.id
       WHERE p.fisioterapeuta_id = ? AND c.fecha = ?`,
      [fisioterapeutaId, fecha]
    );

    return {
      total_pacientes: pacientes[0].total,
      rutinas_activas: rutinas[0].total,
      pacientes_activos_hoy: adherencia[0].total
    };
  }
}
