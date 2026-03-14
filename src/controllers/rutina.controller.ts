import type { Request, Response } from "express";
import { pool } from "../config/database.js";

export const crearRutina = async (req: Request, res: Response) => {
  const { paciente_id, fecha_inicio, observaciones, ejercicios } = req.body;

  const fisioterapeuta_id = (req as any).user.id;

  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    // 1. Desactivar cualquier rutina previa del paciente
    await connection.query(
      `UPDATE rutinas SET activa = 0 WHERE paciente_id = ? AND activa = 1`,
      [paciente_id]
    );

    // 2. Insertar la nueva rutina
    const [result]: any = await connection.query(
      `INSERT INTO rutinas (paciente_id, fisioterapeuta_id, fecha_inicio, observaciones)
       VALUES (?, ?, ?, ?)`,
      [paciente_id, fisioterapeuta_id, fecha_inicio, observaciones]
    );

    const rutinaId = result.insertId;

    for (const ejercicio of ejercicios) {
      await connection.query(
        `INSERT INTO rutina_ejercicios 
         (rutina_id, ejercicio_id, series, repeticiones, frecuencia)
         VALUES (?, ?, ?, ?, ?)`,
        [
          rutinaId,
          ejercicio.ejercicio_id,
          ejercicio.series,
          ejercicio.repeticiones,
          ejercicio.frecuencia
        ]
      );
    }

    await connection.commit();

    res.status(201).json({
      message: 'Rutina creada correctamente',
      rutina_id: rutinaId
    });

  } catch (error) {
    await connection.rollback();
    res.status(500).json({ message: 'Error interno del servidor' });
  } finally {
    connection.release();
  }
};

export const obtenerRutinaActiva = async (req: Request, res: Response) => {
  const { paciente_id } = req.params;

  try {

    const [rutina]: any = await pool.query(
      `SELECT * FROM rutinas 
       WHERE paciente_id = ? AND activa = 1`,
      [paciente_id]
    );

    if (rutina.length === 0) {
      return res.status(404).json({ message: 'No hay rutina activa' });
    }

    const rutinaId = rutina[0].id;

    const [ejercicios]: any = await pool.query(
      `SELECT e.id, e.nombre, e.descripcion, e.video_url,
              re.series, re.repeticiones, re.frecuencia
       FROM rutina_ejercicios re
       INNER JOIN ejercicios e ON re.ejercicio_id = e.id
       WHERE re.rutina_id = ?`,
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
    const [ejercicios]: any = await pool.query(
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
               AND c.fecha = CURDATE()) > 0 AS completadoHoy
       FROM rutina_ejercicios re
       INNER JOIN ejercicios e ON re.ejercicio_id = e.id
       INNER JOIN rutinas r ON re.rutina_id = r.id
       WHERE r.paciente_id = ?
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

    const [rutinas]: any = await pool.query(
      `SELECT id, fecha_inicio, observaciones, activa, fecha_creacion
       FROM rutinas
       WHERE paciente_id = ?
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