import bcrypt from 'bcryptjs';
import { pool } from './database.js';
import { UserRole } from '../types/roles.js';

export const seedDatabase = async () => {
  try {
    // Verificar si existe al menos un administrador
    const { rows }: any = await pool.query(
      'SELECT id FROM usuarios WHERE rol = $1 LIMIT 1',
      [UserRole.ADMIN]
    );

    if (rows.length === 0) {
      console.log('⚠️ No se encontró ningún administrador. Creando administrador por defecto...');

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
         VALUES ($1, $2, $3, $4, $5)`,
        [nombres, apellidos, email, password_hash, rol]
      );

      console.log('✅ Administrador inicial creado con éxito.');
      console.log('📧 Email: admin@rehabsync.com');
      console.log('🔑 Password: admin123');
      console.log('⚠️ Por favor, cambie la contraseña después de iniciar sesión por primera vez.');
    } else {
      console.log('ℹ️ Administrador ya existe en la base de datos.');
    }
  } catch (error) {
    console.error('❌ Error durante la inicialización de la base de datos:', error);
  }
};
