import { pool } from '../config/database.js';

export class UsersRepository {
  static async getPerfilUsuario(userId: string) {
    const [rows]: any = await pool.query(
      `SELECT 
         u.id, u.nombres, u.apellidos, u.email, u.rol, u.activo,
         p.id as paciente_id,
         f.id as fisioterapeuta_id
       FROM usuarios u
       LEFT JOIN pacientes p ON p.usuario_id = u.id
       LEFT JOIN fisioterapeutas f ON f.usuario_id = u.id
       WHERE u.id = ?`,
      [userId]
    );
    return rows[0];
  }

  static async getUserByIdWithPassword(userId: string) {
    const [rows]: any = await pool.query(
      `SELECT id, password_hash FROM usuarios WHERE id = ?`,
      [userId]
    );
    return rows[0];
  }

  static async updatePassword(userId: string, passwordHash: string) {
    await pool.query(
      `UPDATE usuarios SET password_hash = ? WHERE id = ?`,
      [passwordHash, userId]
    );
  }
}
