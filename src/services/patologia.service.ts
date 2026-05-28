import { PatologiaRepository } from '../repositories/patologia.repository.js';
import { AppError } from '../utils/AppError.js';

export class PatologiaService {
  static async crearPatologia(data: any) {
    const { nombre, nivel_gravedad } = data;

    const existente = await PatologiaRepository.findByNameAndGravedad(nombre, nivel_gravedad);
    if (existente) {
      throw new AppError(`La patología "${nombre}" ya tiene registrado el nivel de gravedad "${nivel_gravedad}". No se permiten duplicados.`, 400);
    }

    const total = await PatologiaRepository.countByName(nombre);
    if (total >= 3) {
      throw new AppError(`Ya existen ${total} niveles registrados para la patología "${nombre}". No se permiten más de 3 registros por patología.`, 400);
    }

    return await PatologiaRepository.create(data);
  }

  static async obtenerPatologias() {
    return await PatologiaRepository.findAll();
  }

  static async obtenerEjerciciosPorPatologia(id: number) {
    return await PatologiaRepository.findEjerciciosByPatologiaId(id);
  }

  static async obtenerPatologiaPorId(id: number) {
    const patologia = await PatologiaRepository.findById(id);
    if (!patologia) {
      throw new AppError('Patología no encontrada', 404);
    }
    return patologia;
  }

  static async actualizarPatologia(id: number, data: any) {
    const { nombre, nivel_gravedad } = data;

    const existente = await PatologiaRepository.findByNameAndGravedad(nombre, nivel_gravedad, id);
    if (existente) {
      throw new AppError(`La patología "${nombre}" ya tiene registrado el nivel de gravedad "${nivel_gravedad}". No se permiten duplicados.`, 400);
    }

    const total = await PatologiaRepository.countByName(nombre, id);
    if (total >= 3) {
      throw new AppError(`Ya existen 3 niveles registrados para la patología "${nombre}". No se permiten más registros por patología.`, 400);
    }

    const success = await PatologiaRepository.update(id, data);
    if (!success) {
      throw new AppError('Patología no encontrada', 404);
    }
  }

  static async eliminarPatologia(id: number) {
    const success = await PatologiaRepository.delete(id);
    if (!success) {
      throw new AppError('Patología no encontrada', 404);
    }
  }
}
