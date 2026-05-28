import { pool } from '../config/database.js';

export class AuthRepository {
  static async createUser(userData: any, connection: any) {
    const { nombres, apellidos, email, password_hash, rol } = userData;
    const [result]: any = await connection.query(
      `INSERT INTO usuarios (nombres, apellidos, email, password_hash, rol) VALUES (?, ?, ?, ?, ?)`,
      [nombres, apellidos, email, password_hash, rol]
    );
    return result.insertId;
  }

  static async createFisioterapeuta(fisioterapeutaData: any, connection: any) {
    const { userId, especialidad, telefono } = fisioterapeutaData;
    await connection.query(
      `INSERT INTO fisioterapeutas (usuario_id, especialidad, telefono) VALUES (?, ?, ?)`,
      [userId, especialidad, telefono]
    );
  }

  static async createPaciente(pacienteData: any, connection: any) {
    const { userId, edad, genero, direccion } = pacienteData;
    await connection.query(
      `INSERT INTO pacientes (usuario_id, edad, genero, direccion) VALUES (?, ?, ?, ?)`,
      [userId, edad, genero, direccion]
    );
  }

  static async getUserByEmail(email: string) {
    const [rows]: any = await pool.query(
      `SELECT * FROM usuarios WHERE email = ? AND activo = 1`,
      [email]
    );
    return rows[0];
  }
}
