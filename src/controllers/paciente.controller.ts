import type { Request, Response } from 'express';
import { pool } from '../config/database.js';

export const obtenerEjerciciosRecomendados = async (req: Request, res: Response) => {
  const { paciente_id } = req.params;

  try {
    // 1. Verificar si el paciente existe y traer información clínica relevante
    const [paciente]: any = await pool.query(
      `SELECT id, fase_recuperacion, edad 
      FROM pacientes 
      WHERE id = ?`,
      [paciente_id]
    );

    if (paciente.length === 0) {
      return res.status(404).json({ message: 'Paciente no encontrado' });
    }

    const { fase_recuperacion, edad } = paciente[0];

    // 2. Obtener ejercicios base recomendados basados en patologías y fase
    let [ejercicios]: any = await pool.query(
      `SELECT DISTINCT 
      e.id, 
      e.nombre, 
      e.descripcion, 
      e.nivel_dificultad,
      e.video_url,
      e.fase_recomendada, 
      p.nombre as patologia_nombre
      FROM ejercicios e
      INNER JOIN patologia_ejercicios pe ON e.id = pe.ejercicio_id
      INNER JOIN paciente_patologias pp ON pe.patologia_id = pp.patologia_id
      INNER JOIN patologias p ON pp.patologia_id = p.id
      WHERE pp.paciente_id = ? 
      AND e.fase_recomendada = ?
      AND e.activo = 1`,
      [paciente_id, fase_recuperacion]
    );

    if (ejercicios.length === 0) {
      // Fallback: Si el paciente es nuevo y no tiene patologías registradas, 
      // traer el catálogo sugerido basándonos solo en su fase.
      let queryFallback = `
        SELECT id, nombre, descripcion, nivel_dificultad, video_url, fase_recomendada, 'Catálogo General' as patologia_nombre 
        FROM ejercicios 
        WHERE activo = 1
      `;
      let paramsFallback: any[] = [];

      if (fase_recuperacion) {
        queryFallback += ` AND fase_recomendada = ?`;
        paramsFallback.push(fase_recuperacion);
      }

      const [fallback]: any = await pool.query(queryFallback, paramsFallback);

      if (fallback.length === 0) {
        // En el peor de los casos (ej. la fase de recuperación no exite en los ejercicios), 
        // traer TODOS los ejercicios activos independientemente de la fase.
        const [general]: any = await pool.query(`SELECT id, nombre, descripcion, nivel_dificultad, video_url, fase_recomendada, 'Catálogo Completo' as patologia_nombre FROM ejercicios WHERE activo = 1`);
        ejercicios = general;
      } else {
        ejercicios = fallback;
      }
    }

    // 3. Sistema de Reglas IF-THEN (Motor de Recomendaciones Clínicas)
    let ejercicios_filtrados = [...ejercicios];

    // Regla 1 (Sensibilidad por Edad): IF paciente > 60 THEN excluir Alta Dificultad
    if (edad > 60) {
      ejercicios_filtrados = ejercicios_filtrados.filter((e: any) => e.nivel_dificultad !== 'ALTO');
    }

    // Regla 2 (Priorización Clínica): IF fase = Aguda THEN sugerir dificultad Baja primero
    if (fase_recuperacion === 'Aguda') {
      ejercicios_filtrados.sort((a: any, b: any) => {
        const pesoDificultad: any = { 'BAJO': 1, 'MEDIO': 2, 'ALTO': 3 };
        return pesoDificultad[a.nivel_dificultad] - pesoDificultad[b.nivel_dificultad];
      });
    }

    // Retorno de las recomendaciones ajustadas
    res.json({
      paciente_id,
      fase_recuperacion,
      edad,
      reglas_aplicadas: {
        edad_avanzada: edad > 60,
        fase_aguda: fase_recuperacion === 'Aguda'
      },
      ejercicios_recomendados: ejercicios_filtrados
    });

  } catch (error) {
    console.error('Error en obtenerEjerciciosRecomendados:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};