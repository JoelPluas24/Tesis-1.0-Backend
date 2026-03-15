import type { Request, Response } from 'express';
import { pool } from '../config/database.js';

export const obtenerPerfil = async (req: Request, res: Response) => {
  const user = (req as any).user;

  try {

    const { rows }: any = await pool.query(
      `SELECT 
         u.id, u.nombres, u.apellidos, u.email, u.rol, u.activo,
         p.id as paciente_id,
         f.id as fisioterapeuta_id
       FROM usuarios u
       LEFT JOIN pacientes p ON p.usuario_id = u.id
       LEFT JOIN fisioterapeutas f ON f.usuario_id = u.id
       WHERE u.id = $1`,
      [user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(rows[0]);

  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};