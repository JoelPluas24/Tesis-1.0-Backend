import { EjercicioRepository } from '../repositories/ejercicio.repository.js';
import { AppError } from '../utils/AppError.js';
import { pool } from '../config/database.js';

export class EjercicioService {
  static async crearEjercicio(data: any) {
    return await EjercicioRepository.create(data);
  }

  static async asociarEjercicioPatologia(patologia_id: number, ejercicios_ids: number[]) {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();

      await EjercicioRepository.clearAsociaciones(patologia_id, connection);

      if (ejercicios_ids && ejercicios_ids.length > 0) {
        const values = ejercicios_ids.map((id: number) => [patologia_id, id]);
        await EjercicioRepository.bulkInsertAsociaciones(values, connection);
      }

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async obtenerEjercicios() {
    return await EjercicioRepository.findAll();
  }

  static async obtenerEjercicioPorId(id: number) {
    const ejercicio = await EjercicioRepository.findById(id);
    if (!ejercicio) {
      throw new AppError('Ejercicio no encontrado', 404);
    }
    return ejercicio;
  }

  static async actualizarEjercicio(id: number, data: any) {
    const success = await EjercicioRepository.update(id, data);
    if (!success) {
      throw new AppError('Ejercicio no encontrado', 404);
    }
  }

  static async eliminarEjercicio(id: number) {
    const success = await EjercicioRepository.delete(id);
    if (!success) {
      throw new AppError('Ejercicio no encontrado', 404);
    }
  }
}
