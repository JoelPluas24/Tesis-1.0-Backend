import bcrypt from 'bcryptjs';
import { UsersRepository } from '../repositories/users.repository.js';
import { AppError } from '../utils/AppError.js';

export class UsersService {
  static async obtenerPerfil(userId: number) {
    const profile = await UsersRepository.getPerfilUsuario(userId);
    if (!profile) {
      throw new AppError('Usuario no encontrado', 404);
    }
    return profile;
  }

  static async cambiarPassword(userId: number, currentPassword: string, newPassword: string) {
    const user = await UsersRepository.getUserByIdWithPassword(userId);
    if (!user) {
      throw new AppError('Usuario no encontrado', 404);
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isMatch) {
      throw new AppError('La contraseña actual es incorrecta', 400);
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await UsersRepository.updatePassword(userId, newHash);
  }
}
