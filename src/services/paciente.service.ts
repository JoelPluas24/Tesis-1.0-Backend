import { PacienteRepository } from '../repositories/paciente.repository.js';
import { AppError } from '../utils/AppError.js';
import { MotorInferencia } from '../utils/motorInferencia.util.js';

export class PacienteService {
  static async obtenerEjerciciosRecomendados(pacienteId: number) {
    const paciente = await PacienteRepository.getPacienteById(pacienteId);

    if (!paciente) {
      throw new AppError('Paciente no encontrado', 404);
    }

    const { fase_recuperacion, edad } = paciente;

    let ejercicios = await PacienteRepository.getEjerciciosRecomendadosBase(pacienteId, fase_recuperacion);

    if (ejercicios.length === 0) {
      const ejerciciosPatologia = await PacienteRepository.getEjerciciosPorPatologia(pacienteId);

      if (ejerciciosPatologia.length > 0) {
        ejercicios = ejerciciosPatologia;
      } else {
        const fallback = await PacienteRepository.getEjerciciosFallback(fase_recuperacion);

        if (fallback.length === 0) {
          ejercicios = await PacienteRepository.getEjerciciosGeneral();
        } else {
          ejercicios = fallback;
        }
      }
    }

    // 1. Base de Conocimientos: Reglas Clínicas Desacopladas
    const reglasClinicas = [
      {
        nombre: 'edad_avanzada',
        condicion: (hechos: any) => hechos.edad > 60,
        accion: (listaEjercicios: any[]) => listaEjercicios.filter(e => e.nivel_dificultad !== 'ALTO')
      },
      {
        nombre: 'fase_aguda',
        condicion: (hechos: any) => hechos.fase_recuperacion === 'AGUDA',
        accion: (listaEjercicios: any[]) => {
          const clon = [...listaEjercicios];
          return clon.sort((a, b) => {
            const peso: any = { 'BAJO': 1, 'MEDIO': 2, 'ALTO': 3 };
            return peso[a.nivel_dificultad] - peso[b.nivel_dificultad];
          });
        }
      }
    ];

    // 2. Instanciar Motor de Inferencia
    const motor = new MotorInferencia(reglasClinicas);

    // 3. Ejecutar Encadenamiento Hacia Adelante con Hechos
    const inferencia = motor.evaluar(
      { edad, fase_recuperacion },
      ejercicios
    );

    return {
      paciente_id: pacienteId,
      fase_recuperacion,
      edad,
      reglas_aplicadas: inferencia.reglasAplicadas,
      ejercicios_recomendados: inferencia.ejercicios
    };
  }
}
