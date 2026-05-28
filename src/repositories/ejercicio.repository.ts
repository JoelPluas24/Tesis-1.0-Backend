import { pool } from '../config/database.js';

export class EjercicioRepository {
  static async create(data: any) {
    const { nombre, descripcion, indicaciones, contraindicaciones, nivel_dificultad, video_url } = data;
    const [result]: any = await pool.query(
      `INSERT INTO ejercicios (nombre, descripcion, indicaciones, contraindicaciones, nivel_dificultad, video_url)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nombre, descripcion, indicaciones, contraindicaciones, nivel_dificultad, video_url]
    );
    return result.insertId;
  }

  static async clearAsociaciones(patologia_id: number, connection: any) {
    await connection.query('DELETE FROM patologia_ejercicios WHERE patologia_id = ?', [patologia_id]);
  }

  static async bulkInsertAsociaciones(values: any[], connection: any) {
    await connection.query(
      `INSERT INTO patologia_ejercicios (patologia_id, ejercicio_id) VALUES ?`,
      [values]
    );
  }

  static async clearAsociacionesNoAuth(patologia_id: number) {
    await pool.query('DELETE FROM patologia_ejercicios WHERE patologia_id = ?', [patologia_id]);
  }

  static async bulkInsertAsociacionesNoAuth(values: any[]) {
    await pool.query(
      `INSERT INTO patologia_ejercicios (patologia_id, ejercicio_id) VALUES ?`,
      [values]
    );
  }

  static async findAll() {
    const [rows]: any = await pool.query('SELECT * FROM ejercicios WHERE activo = 1 ORDER BY fecha_creacion DESC');
    return rows;
  }

  static async findById(id: number) {
    const [rows]: any = await pool.query('SELECT * FROM ejercicios WHERE id = ?', [id]);
    return rows[0];
  }

  static async update(id: number, data: any) {
    const { nombre, descripcion, indicaciones, contraindicaciones, nivel_dificultad, video_url } = data;
    const [result]: any = await pool.query(
      `UPDATE ejercicios 
       SET nombre = ?, descripcion = ?, indicaciones = ?, contraindicaciones = ?, nivel_dificultad = ?, video_url = ?
       WHERE id = ?`,
      [nombre, descripcion, indicaciones, contraindicaciones, nivel_dificultad, video_url, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id: number) {
    const [result]: any = await pool.query('UPDATE ejercicios SET activo = 0 WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}
