import type { Request, Response } from "express";
import { pool } from "../config/database.js";

export const crearRutina = async (req: Request, res: Response) => {
  const { paciente_id, fecha_inicio, observaciones, ejercicios } = req.body;

  const fisioterapeuta_id = (req as any).user.id;

  const connection = await pool.connect();
  await connection.query('BEGIN');

  try {
    // 1. Desactivar cualquier rutina previa del paciente
    await connection.query(
      `UPDATE rutinas SET activa = false WHERE paciente_id = $1 AND activa = true`,
      [paciente_id]
    );

    // 2. Insertar la nueva rutina
    const { rows: result }: any = await connection.query(
      `INSERT INTO rutinas (paciente_id, fisioterapeuta_id, fecha_inicio, observaciones)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [paciente_id, fisioterapeuta_id, fecha_inicio, observaciones]
    );

    const rutinaId = result[0].id;

    for (const ejercicio of ejercicios) {
      await connection.query(
        `INSERT INTO rutina_ejercicios 
         (rutina_id, ejercicio_id, series, repeticiones, frecuencia)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          rutinaId,
          ejercicio.ejercicio_id,
          ejercicio.series,
          ejercicio.repeticiones,
          ejercicio.frecuencia
        ]
      );
    }

    await connection.query('COMMIT');

    res.status(201).json({
      message: 'Rutina creada correctamente',
      rutina_id: rutinaId
    });

  } catch (error) {
    await connection.query('ROLLBACK');
    res.status(500).json({ message: 'Error interno del servidor' });
  } finally {
    connection.release();
  }
};

export const obtenerRutinaActiva = async (req: Request, res: Response) => {
  const { paciente_id } = req.params;

  try {

    const { rows: rutina }: any = await pool.query(
      `SELECT * FROM rutinas 
       WHERE paciente_id = $1 AND activa = true`,
      [paciente_id]
    );

    if (rutina.length === 0) {
      return res.status(404).json({ message: 'No hay rutina activa' });
    }

    const rutinaId = rutina[0].id;

    const { rows: ejercicios }: any = await pool.query(
      `SELECT e.id, e.nombre, e.descripcion, e.video_url,
              re.series, re.repeticiones, re.frecuencia
       FROM rutina_ejercicios re
       INNER JOIN ejercicios e ON re.ejercicio_id = e.id
       WHERE re.rutina_id = $1`,
      [rutinaId]
    );

    res.json({
      rutina: rutina[0],
      ejercicios
    });

  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const obtenerTodosLosEjerciciosPaciente = async (req: Request, res: Response) => {
  const { paciente_id } = req.params;

  try {
    const { rows: ejercicios }: any = await pool.query(
      `SELECT DISTINCT 
              e.id, 
              e.nombre, 
              e.descripcion, 
              e.video_url,
              re.series, 
              re.repeticiones, 
              re.frecuencia,
              r.fecha_creacion,
              (SELECT COUNT(*) FROM cumplimiento_ejercicios c 
               WHERE c.ejercicio_id = e.id 
               AND c.paciente_id = r.paciente_id 
               AND c.fecha = CURRENT_DATE) > 0 AS "completadoHoy"
       FROM rutina_ejercicios re
       INNER JOIN ejercicios e ON re.ejercicio_id = e.id
       INNER JOIN rutinas r ON re.rutina_id = r.id
       WHERE r.paciente_id = $1
       ORDER BY r.fecha_creacion DESC`,
      [paciente_id]
    );

    res.json(ejercicios);

  } catch (error) {
    console.error('Error al obtener ejercicios históricos:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
export const obtenerHistorialRutinas = async (req: Request, res: Response) => {
  const { paciente_id } = req.params;

  try {

    const { rows: rutinas }: any = await pool.query(
      `SELECT id, fecha_inicio, observaciones, activa, fecha_creacion
       FROM rutinas
       WHERE paciente_id = $1
       ORDER BY fecha_creacion DESC`,
      [paciente_id]
    );

    res.json({
      paciente_id,
      historial: rutinas
    });

  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};