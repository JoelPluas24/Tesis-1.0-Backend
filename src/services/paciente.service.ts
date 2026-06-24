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
        // REGLA 1: Pacientes mayores de 60 años — excluir ejercicios con impacto articular y priorizar movilidad/estiramiento
        nombre: 'edad_avanzada',
        condicion: (hechos: any) => hechos.edad > 60,
        accion: (listaEjercicios: any[]) => 
          listaEjercicios.filter(e => e.impacto_articular === 0 && e.nivel_dificultad !== 'ALTO')
      },
      // REGLA 2: En fase aguda — solo ejercicios sin carga ni impacto articular, ordenados de menor a mayor dificultad
      {
        nombre: 'fase_aguda',
        condicion: (hechos: any) => hechos.fase_recuperacion === 'AGUDA',
        accion: (listaEjercicios: any[]) => {
          const filtrados = listaEjercicios.filter(e => 
            e.requiere_carga === 0 && 
            e.impacto_articular === 0 &&
            (e.tipo_ejercicio === 'MOVILIDAD' || e.tipo_ejercicio === 'ESTIRAMIENTO')
          );
          return filtrados.sort((a, b) => {
            const peso: any = { 'BAJO': 1, 'MEDIO': 2 };
            return (peso[a.nivel_dificultad] || 3) - (peso[b.nivel_dificultad] || 3);
          });
        }
      },
      {
      // REGLA 3: Nivel de dolor alto (6-10) — solo ejercicios de movilidad o estiramiento sin carga
        nombre: 'nivel_dolor_alto',
        condicion: (hechos: any) => hechos.nivel_dolor >= 6,
        accion: (listaEjercicios: any[]) => listaEjercicios.filter(e => 
          (e.tipo_ejercicio === 'MOVILIDAD' || e.tipo_ejercicio === 'ESTIRAMIENTO') &&
          e.requiere_carga === 0
        )
      },
      {
        // REGLA 4: Comorbilidad cardíaca — excluye ejercicios que requieran carga o sean de alta intensidad
        nombre: 'comorbilidad_cardiaca',
        condicion: (hechos: any) => 
          hechos.comorbilidades?.includes('CARDIACA') || 
          hechos.comorbilidades?.includes('HIPERTENSION'),
        accion: (listaEjercicios: any[]) => listaEjercicios.filter(e => 
          e.requiere_carga === 0 && e.nivel_dificultad !== 'ALTO'
        )
      },
      // REGLA 5: Fase fortalecimiento — permite todos los niveles y tipos para progresar, ordenados de menor a mayor dificultad
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
      // REGLA 6: Paciente sedentario — solo ejercicios sin impacto articular y sin carga
      {
        nombre: 'vida_sedentaria',
        condicion: (hechos: any) => hechos.nivel_actividad_fisica === 'SEDENTARIO',
        accion: (listaEjercicios: any[]) => 
          listaEjercicios.filter(e => e.impacto_articular === 0 && e.requiere_carga === 0)
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
      ejercicios_recomendados: inferencia.ejercicios,
      catalogo_general: ejercicios
    };
  }
}
