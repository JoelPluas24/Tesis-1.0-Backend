import crypto from 'crypto';
import { pool } from '../config/database.js';

export class AuthRepository {
  static async createUser(userData: any, connection: any) {
    const id = crypto.randomUUID();
    const { nombres, apellidos, email, password_hash, rol } = userData;
    await connection.query(
      `INSERT INTO usuarios (id, nombres, apellidos, email, password_hash, rol) VALUES (?, ?, ?, ?, ?, ?)`,
      [id, nombres, apellidos, email, password_hash, rol]
    );
    return id;
  }

  static async createFisioterapeuta(fisioterapeutaData: any, connection: any) {
    const id = crypto.randomUUID();
    const { userId, especialidad, telefono } = fisioterapeutaData;
    await connection.query(
      `INSERT INTO fisioterapeutas (id, usuario_id, especialidad, telefono) VALUES (?, ?, ?, ?)`,
      [id, userId, especialidad, telefono]
    );
  }

  static async createPaciente(pacienteData: any, connection: any) {
    const id = crypto.randomUUID();
    const { userId, edad, genero, direccion } = pacienteData;
    await connection.query(
      `INSERT INTO pacientes (id, usuario_id, edad, genero, direccion) VALUES (?, ?, ?, ?, ?)`,
      [id, userId, edad, genero, direccion]
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
