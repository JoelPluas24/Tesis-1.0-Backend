import { pool } from '../config/database.js';

export class PacienteRepository {
  static async getPacienteById(id: number) {
    const [rows]: any = await pool.query(
      `SELECT id, usuario_id, fase_recuperacion, edad FROM pacientes WHERE id = ?`,
      [id]
    );
    return rows[0];
  }

  static async getEjerciciosRecomendadosBase(pacienteId: number, faseRecuperacion: string) {
    const [rows]: any = await pool.query(
      `SELECT DISTINCT 
      e.id, e.nombre, e.descripcion, e.nivel_dificultad, e.video_url, p.nombre as patologia_nombre
      FROM ejercicios e
      INNER JOIN patologia_ejercicios pe ON e.id = pe.ejercicio_id
      INNER JOIN paciente_patologias pp ON pe.patologia_id = pp.patologia_id
      INNER JOIN patologias p ON pp.patologia_id = p.id
      WHERE pp.paciente_id = ? 
      AND e.activo = 1`,
      [pacienteId]
    );
    return rows;
  }

  static async getEjerciciosPorPatologia(pacienteId: number) {
    const [rows]: any = await pool.query(
      `SELECT DISTINCT 
      e.id, e.nombre, e.descripcion, e.nivel_dificultad, e.video_url, p.nombre as patologia_nombre
      FROM ejercicios e
      INNER JOIN patologia_ejercicios pe ON e.id = pe.ejercicio_id
      INNER JOIN paciente_patologias pp ON pe.patologia_id = pp.patologia_id
      INNER JOIN patologias p ON pp.patologia_id = p.id
      WHERE pp.paciente_id = ? 
      AND e.activo = 1`,
      [pacienteId]
    );
    return rows;
  }

  static async getEjerciciosFallback(faseRecuperacion?: string) {
    let queryFallback = `
      SELECT id, nombre, descripcion, nivel_dificultad, video_url, 'Catálogo General' as patologia_nombre 
      FROM ejercicios 
      WHERE activo = 1
    `;
    let paramsFallback: any[] = [];

    // if (faseRecuperacion) {
    //   queryFallback += ` AND fase_recomendada = ?`;
    //   paramsFallback.push(faseRecuperacion);
    // }

    const [rows]: any = await pool.query(queryFallback, paramsFallback);
    return rows;
  }

  static async getEjerciciosGeneral() {
    const [rows]: any = await pool.query(`
      SELECT id, nombre, descripcion, nivel_dificultad, video_url, 'Catálogo Completo' as patologia_nombre 
      FROM ejercicios 
      WHERE activo = 1
    `);
    return rows;
  }

  static async actualizarFaseRecuperacion(pacienteId: number, fase: string) {
    const [result]: any = await pool.query(
      `UPDATE pacientes SET fase_recuperacion = ? WHERE id = ?`,
      [fase, pacienteId]
    );
    return result;
  }
}
