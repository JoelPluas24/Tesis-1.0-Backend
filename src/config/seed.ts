import bcrypt from 'bcryptjs';
import { pool } from './database.js';
import { UserRole } from '../types/roles.js';
import { logger } from '../utils/logger.js';

export const seedDatabase = async () => {
  try {
    // Verificar si existe al menos un administrador
    const [rows]: any = await pool.query(
      'SELECT id FROM usuarios WHERE rol = ? LIMIT 1',
      [UserRole.ADMIN]
    );

    if (rows.length === 0) {
      logger.info('No se encontró ningún administrador. Creando administrador por defecto...');

      const nombres = 'Administrador';
      const apellidos = 'Sistema';
      const email = 'admin@rehabsync.com';
      const password = 'admin123';
      const rol = UserRole.ADMIN;

      // Hashear contraseña
      const password_hash = await bcrypt.hash(password, 10);

      // Insertar usuario administrador
      await pool.query(
        `INSERT INTO usuarios (nombres, apellidos, email, password_hash, rol)
         VALUES (?, ?, ?, ?, ?)`,
        [nombres, apellidos, email, password_hash, rol]
      );

      logger.info('Administrador inicial creado con éxito.');
      logger.info('Email: admin@rehabsync.com');
      logger.info('Password: admin123');
      logger.info('Por favor, cambie la contraseña después de iniciar sesión por primera vez.');
    } else {
      logger.info('Administrador ya existe en la base de datos.');
    }
  } catch (error) {
    logger.error('Error durante la inicialización de la base de datos:', error);
  }
};
