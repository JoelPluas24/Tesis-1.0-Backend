import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthRepository } from '../repositories/auth.repository.js';
import { UsersRepository } from '../repositories/users.repository.js';
import { UserRole } from '../types/roles.js';
import { AppError } from '../utils/AppError.js';
import { pool } from '../config/database.js';

export class AuthService {
  static async registerUser(data: any) {
    const { nombres, apellidos, email, password, rol, especialidad, telefono, edad, genero, direccion } = data;

    if (!Object.values(UserRole).includes(rol)) {
      throw new AppError('Rol inválido', 400);
    }

    const password_hash = await bcrypt.hash(password, 10);
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const userId = await AuthRepository.createUser(
        { nombres, apellidos, email, password_hash, rol },
        connection
      );

      if (rol === UserRole.FISIOTERAPEUTA) {
        await AuthRepository.createFisioterapeuta(
          { userId, especialidad, telefono },
          connection
        );
      }

      if (rol === UserRole.PACIENTE) {
        let mappedGenero = genero;
        if (genero === 'MASCULINO') mappedGenero = 'M';
        if (genero === 'FEMENINO') mappedGenero = 'F';

        await AuthRepository.createPaciente(
          { userId, edad, genero: mappedGenero, direccion },
          connection
        );
      }

      await connection.commit();
      return userId;
    } catch (error: any) {
      await connection.rollback();
      if (error.code === 'ER_DUP_ENTRY') {
        throw new AppError('El email ya está registrado', 400);
      }
      throw error;
    } finally {
      connection.release();
    }
  }

  static async loginUser(email: string, password: string) {
    const user = await AuthRepository.getUserByEmail(email);
    if (!user) {
      throw new AppError('Credenciales inválidas', 400);
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      throw new AppError('Credenciales inválidas', 400);
    }

    const accessToken = jwt.sign(
      { id: user.id, rol: user.rol, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: '2h' }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET as string,
      { expiresIn: '7d' }
    );

    return { accessToken, refreshToken, user: { id: user.id, rol: user.rol, email: user.email, nombres: user.nombres, apellidos: user.apellidos } };
  }

  static async refreshAccessToken(refreshToken: string) {
    if (!refreshToken) {
      throw new AppError('Refresh token requerido', 401);
    }

    try {
      const decoded: any = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string);

      const user = await UsersRepository.getPerfilUsuario(decoded.id);
      if (!user) {
        throw new AppError('Usuario no encontrado', 404);
      }
      if (!user.activo) {
        throw new AppError('Usuario inactivo', 403);
      }

      const newAccessToken = jwt.sign(
        { id: user.id, rol: user.rol, email: user.email },
        process.env.JWT_SECRET as string,
        { expiresIn: '2h' }
      );

      return newAccessToken;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Refresh token inválido', 403);
    }
  }
}
