import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { pool } from '../config/database.js';
import { UserRole } from '../types/roles.js';
import jwt from 'jsonwebtoken';


export const registerUser = async (req: Request, res: Response) => {
  const { nombres, apellidos, email, password, rol, especialidad, telefono, edad, genero, direccion } = req.body;

  try {
    // Validar rol permitido
    if (!Object.values(UserRole).includes(rol)) {
      return res.status(400).json({ message: 'Rol inválido' });
    }

    // Hashear contraseña
    const password_hash = await bcrypt.hash(password, 10);

    // Insertar usuario
    const { rows: result }: any = await pool.query(
      `INSERT INTO usuarios (nombres, apellidos, email, password_hash, rol)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [nombres, apellidos, email, password_hash, rol]
    );

    const userId = result[0].id;

    // Si es fisioterapeuta
    if (rol === UserRole.FISIOTERAPEUTA) {
      await pool.query(
        `INSERT INTO fisioterapeutas (usuario_id, especialidad, telefono)
         VALUES ($1, $2, $3)`,
        [userId, especialidad, telefono]
      );
    }

    // Si es paciente
    if (rol === UserRole.PACIENTE) {
      await pool.query(
        `INSERT INTO pacientes (usuario_id, edad, genero, direccion)
         VALUES ($1, $2, $3, $4)`,
        [userId, edad, genero, direccion]
      );
    }

    res.status(201).json({
      message: 'Usuario creado correctamente'
    });

  } catch (error: any) {
    console.error(error);

    if (error.code === '23505') { // PostgreSQL unique violation error code
      return res.status(400).json({ message: 'El email ya está registrado' });
    }

    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const { rows }: any = await pool.query(
      `SELECT * FROM usuarios WHERE email = $1 AND activo = true`,
      [email]
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    const accessToken = jwt.sign(
      {
        id: user.id,
        rol: user.rol,
        email: user.email
      },
      process.env.JWT_SECRET as string,
      { expiresIn: '30d' }
    );

    const refreshToken = jwt.sign(
      {
        id: user.id
      },
      process.env.JWT_REFRESH_SECRET as string,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login exitoso',
      accessToken,
      refreshToken
    });

  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const refreshAccessToken = (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token requerido' });
  }

  jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET as string,
    (err: any, user: any) => {

      if (err) {
        return res.status(403).json({ message: 'Refresh token inválido' });
      }

      const newAccessToken = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET as string,
        { expiresIn: '15m' }
      );

      res.json({ accessToken: newAccessToken });
    }
  );
};