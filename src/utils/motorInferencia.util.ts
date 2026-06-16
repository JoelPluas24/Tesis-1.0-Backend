export interface HechosPaciente {
  edad: number;
  fase_recuperacion: string;
  nivel_dolor?: number; // Escala de 0 a 10
  comorbilidades?: string[]; // Ej: ['CARDIACA', 'HIPERTENSION', 'DIABETES']
  nivel_actividad_fisica?: string; // Ej: 'SEDENTARIO', 'MODERADAMENTE_ACTIVO', 'ACTIVO', 'DEPORTISTA'
  [key: string]: any;
}

export interface ReglaClinica {
  nombre: string;
  /**
   * Evaluador Lógico (SI / IF):
   * Analiza los hechos para determinar si la regla debe dispararse.
   */
  condicion: (hechos: HechosPaciente) => boolean;
  
  /**
   * Acción Consecuente (ENTONCES / THEN):
   * Modifica el estado de las recomendaciones cuando la condición se cumple.
   */
  accion: (ejercicios: any[]) => any[];
}

export class MotorInferencia {
  private baseConocimientos: ReglaClinica[];

  constructor(reglas: ReglaClinica[]) {
    this.baseConocimientos = reglas;
  }

  /**
   * Motor evaluador genérico - Encadenamiento hacia adelante (Forward Chaining).
   * Evalúa secuencialmente la base de conocimiento contra los hechos del paciente.
   */
  evaluar(hechos: HechosPaciente, catalogoEjercicios: any[]) {
    let ejerciciosResultantes = [...catalogoEjercicios];
    const reglasAplicadas: Record<string, boolean> = {};

    // Inicializamos el reporte de reglas (false por defecto)
    for (const regla of this.baseConocimientos) {
      reglasAplicadas[regla.nombre] = false;
    }

    // PARA cada regla en la base de conocimientos...
    for (const regla of this.baseConocimientos) {
      // SI las condiciones lógicas coinciden con los hechos...
      if (regla.condicion(hechos)) {
        // ENTONCES inferir la acción sobre el catálogo de ejercicios
        ejerciciosResultantes = regla.accion(ejerciciosResultantes);
        
        // Registrar que la regla fue disparada
        reglasAplicadas[regla.nombre] = true;
      }
    }

    return {
      ejercicios: ejerciciosResultantes,
      reglasAplicadas
    };
  }
}
