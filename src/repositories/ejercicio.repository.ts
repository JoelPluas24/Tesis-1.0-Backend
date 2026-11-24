import crypto from 'crypto';
import { pool } from '../config/database.js';

export class EjercicioRepository {
  static async create(data: any) {
    const id = crypto.randomUUID();
    const { nombre, descripcion, indicaciones, contraindicaciones, nivel_dificultad, video_url, tipo_ejercicio, requiere_carga, impacto_articular } = data;
    await pool.query(
      `INSERT INTO ejercicios (id, nombre, descripcion, indicaciones, contraindicaciones, nivel_dificultad, video_url, tipo_ejercicio, requiere_carga, impacto_articular)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, nombre, descripcion, indicaciones, contraindicaciones, nivel_dificultad, video_url, tipo_ejercicio || 'MOVILIDAD', requiere_carga ? 1 : 0, impacto_articular ? 1 : 0]
    );
    return id;
  }

  static async clearAsociaciones(patologia_id: string, connection: any) {
    await connection.query('DELETE FROM patologia_ejercicios WHERE patologia_id = ?', [patologia_id]);
  }

  static async bulkInsertAsociaciones(values: any[], connection: any) {
    await connection.query(
      `INSERT INTO patologia_ejercicios (patologia_id, ejercicio_id) VALUES ?`,
      [values]
    );
  }

  static async clearAsociacionesNoAuth(patologia_id: string) {
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

  static async findById(id: string) {
    const [rows]: any = await pool.query('SELECT * FROM ejercicios WHERE id = ?', [id]);
    return rows[0];
  }

  static async update(id: string, data: any) {
    const { nombre, descripcion, indicaciones, contraindicaciones, nivel_dificultad, video_url, tipo_ejercicio, requiere_carga, impacto_articular } = data;
    const [result]: any = await pool.query(
      `UPDATE ejercicios 
       SET nombre = ?, descripcion = ?, indicaciones = ?, contraindicaciones = ?, nivel_dificultad = ?, video_url = ?, tipo_ejercicio = ?, requiere_carga = ?, impacto_articular = ?
       WHERE id = ?`,
      [nombre, descripcion, indicaciones, contraindicaciones, nivel_dificultad, video_url, tipo_ejercicio || 'MOVILIDAD', requiere_carga ? 1 : 0, impacto_articular ? 1 : 0, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id: string) {
    const [result]: any = await pool.query('UPDATE ejercicios SET activo = 0 WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}
