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
        // REGLA 1: Pacientes mayores de 60 años no deben realizar ejercicios de alta dificultad
        nombre: 'edad_avanzada',
        condicion: (hechos: any) => hechos.edad > 60,
        accion: (listaEjercicios: any[]) => 
          listaEjercicios.filter(e => e.nivel_dificultad !== 'ALTO')
      },
      // REGLA 2: En fase aguda no se permiten ejercicios ALTO, y se ordenan de menor a mayor dificultad
      {
        nombre: 'fase_aguda',
        condicion: (hechos: any) => hechos.fase_recuperacion === 'AGUDA',
        accion: (listaEjercicios: any[]) => {
          const filtrados = listaEjercicios.filter(e => e.nivel_dificultad !== 'ALTO');
          return filtrados.sort((a, b) => {
            const peso: any = { 'BAJO': 1, 'MEDIO': 2 };
            return peso[a.nivel_dificultad] - peso[b.nivel_dificultad];
          });
        }
      },
      // --- NUEVAS REGLAS AGREGADAS ---
      {
      // REGLA 3: Nivel de dolor alto (6-10) — solo ejercicios de nivel BAJO
        nombre: 'nivel_dolor_alto',
        condicion: (hechos: any) => hechos.nivel_dolor >= 6,
        accion: (listaEjercicios: any[]) => listaEjercicios.filter(e => e.nivel_dificultad === 'BAJO')
      },
      {
        // REGLA 4: Comorbilidad cardíaca — excluye ejercicios de alta intensidad
        nombre: 'comorbilidad_cardiaca',
        condicion: (hechos: any) => 
          hechos.comorbilidades?.includes('CARDIACA') || 
          hechos.comorbilidades?.includes('HIPERTENSION'),
        accion: (listaEjercicios: any[]) => listaEjercicios.filter(e => e.nivel_dificultad !== 'ALTO')
      },
      // REGLA 5: Fase fortalecimiento — permite todos los niveles para progresar, pero siempre ordenados de menor a mayor dificultad para respetar el calentamiento
      {
        nombre: 'fase_fortalecimiento',
        condicion: (hechos: any) => hechos.fase_recuperacion === 'FORTALECIMIENTO',
        accion: (listaEjercicios: any[]) => {
          const clon = [...listaEjercicios];
          return clon.sort((a, b) => {
            const peso: any = { 'BAJO': 1, 'MEDIO': 2, 'ALTO': 3 };
            return peso[a.nivel_dificultad] - peso[b.nivel_dificultad];
          });
        }
      },
      // REGLA 6: Paciente sedentario — solo ejercicios de nivel BAJO
      {
        nombre: 'vida_sedentaria',
        condicion: (hechos: any) => hechos.nivel_actividad_fisica === 'SEDENTARIO',
        accion: (listaEjercicios: any[]) => 
          listaEjercicios.filter(e => e.nivel_dificultad === 'BAJO')
      }
    ];

    // 2. Instanciar Motor de Inferencia
    const motor = new MotorInferencia(reglasClinicas);

    const hechosAdicionales = {
      nivel_dolor: paciente.nivel_dolor,
      comorbilidades: paciente.comorbilidades,
      nivel_actividad_fisica: paciente.nivel_actividad_fisica
    };

    // 3. Ejecutar Encadenamiento Hacia Adelante con Hechos
    const inferencia = motor.evaluar(
      { edad, fase_recuperacion, ...hechosAdicionales },
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
