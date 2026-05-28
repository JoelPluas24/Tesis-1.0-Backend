import { pool } from '../config/database.js';

export class PatologiaRepository {
  static async create(data: any) {
    const { nombre, descripcion, nivel_gravedad } = data;
    const [result]: any = await pool.query(
      `INSERT INTO patologias (nombre, descripcion, nivel_gravedad) VALUES (?, ?, ?)`,
      [nombre, descripcion, nivel_gravedad]
    );
    return result.insertId;
  }

  static async findAll() {
    const [rows]: any = await pool.query('SELECT * FROM patologias WHERE activa = 1 ORDER BY fecha_creacion DESC');
    return rows;
  }

  static async findEjerciciosByPatologiaId(id: number) {
    const [rows]: any = await pool.query(
      `SELECT e.*
       FROM ejercicios e
       INNER JOIN patologia_ejercicios pe ON e.id = pe.ejercicio_id
       WHERE pe.patologia_id = ?
       AND e.activo = 1`,
      [id]
    );
    return rows;
  }

  static async findById(id: number) {
    const [rows]: any = await pool.query('SELECT * FROM patologias WHERE id = ?', [id]);
    return rows[0];
  }

  static async update(id: number, data: any) {
    const { nombre, descripcion, nivel_gravedad } = data;
    const [result]: any = await pool.query(
      `UPDATE patologias SET nombre = ?, descripcion = ?, nivel_gravedad = ? WHERE id = ?`,
      [nombre, descripcion, nivel_gravedad, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id: number) {
    const [result]: any = await pool.query('UPDATE patologias SET activa = 0 WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async countByName(nombre: string, excludeId?: number) {
    let query = 'SELECT COUNT(*) as total FROM patologias WHERE nombre = ? AND activa = 1';
    let params: any[] = [nombre];
    if (excludeId) {
      query += ' AND id != ?';
      params.push(excludeId);
    }
    const [rows]: any = await pool.query(query, params);
    return rows[0].total;
  }

  static async findByNameAndGravedad(nombre: string, nivel_gravedad: string, excludeId?: number) {
    let query = 'SELECT * FROM patologias WHERE nombre = ? AND nivel_gravedad = ? AND activa = 1';
    let params: any[] = [nombre, nivel_gravedad];
    if (excludeId) {
      query += ' AND id != ?';
      params.push(excludeId);
    }
    const [rows]: any = await pool.query(query, params);
    return rows[0];
  }
}
