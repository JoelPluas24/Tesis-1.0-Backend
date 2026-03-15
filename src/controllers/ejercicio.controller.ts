import type { Request, Response } from 'express';
import { pool } from '../config/database.js';

export const crearEjercicio = async (req: Request, res: Response) => {
  const {
    nombre,
    descripcion,
    indicaciones,
    contraindicaciones,
    nivel_dificultad,
    video_url
  } = req.body;

  try {

    const { rows: result }: any = await pool.query(
      `INSERT INTO ejercicios
       (nombre, descripcion, indicaciones, contraindicaciones, nivel_dificultad, video_url)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [nombre, descripcion, indicaciones, contraindicaciones, nivel_dificultad, video_url]
    );

    res.status(201).json({
      message: 'Ejercicio creado correctamente',
      id: result[0].id
    });

  } catch (error) {
    console.error("Error al crear ejercicio:", error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const asociarEjercicioPatologia = async (req: Request, res: Response) => {
  const { patologia_id, ejercicios_ids } = req.body;

  try {
    // Primero, limpiamos las asociaciones anteriores para esa patología
    await pool.query('DELETE FROM patologia_ejercicios WHERE patologia_id = $1', [patologia_id]);

    if (!ejercicios_ids || ejercicios_ids.length === 0) {
      return res.status(200).json({ message: 'Asociaciones actualizadas (vacío)' });
    }

    // Preparamos los valores para la inserción masiva
    const placeholders = ejercicios_ids.map((_: any, i: number) => `($1, $${i + 2})`).join(', ');
    
    await pool.query(
      `INSERT INTO patologia_ejercicios (patologia_id, ejercicio_id) VALUES ${placeholders}`,
      [patologia_id, ...ejercicios_ids]
    );

    res.status(201).json({
      message: 'Ejercicios asociados correctamente a la patología'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const obtenerEjercicios = async (req: Request, res: Response) => {
  try {
    const { rows: ejercicios } = await pool.query('SELECT * FROM ejercicios WHERE activo = true ORDER BY fecha_creacion DESC');
    res.status(200).json(ejercicios);
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const obtenerEjercicioPorId = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const { rows: ejercicio }: any = await pool.query('SELECT * FROM ejercicios WHERE id = $1', [id]);
    if (ejercicio.length === 0) {
      return res.status(404).json({ message: 'Ejercicio no encontrado' });
    }
    res.status(200).json(ejercicio[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const actualizarEjercicio = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    nombre,
    descripcion,
    indicaciones,
    contraindicaciones,
    nivel_dificultad,
    video_url
  } = req.body;

  try {
    const result: any = await pool.query(
      `UPDATE ejercicios 
       SET nombre = $1, descripcion = $2, indicaciones = $3, contraindicaciones = $4, nivel_dificultad = $5, video_url = $6
       WHERE id = $7`,
      [nombre, descripcion, indicaciones, contraindicaciones, nivel_dificultad, video_url, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Ejercicio no encontrado' });
    }

    res.status(200).json({ message: 'Ejercicio actualizado correctamente' });
  } catch (error) {
    console.error("Error al actualizar ejercicio:", error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const eliminarEjercicio = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result: any = await pool.query('UPDATE ejercicios SET activo = false WHERE id = $1', [id]);
    
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Ejercicio no encontrado' });
    }

    res.status(200).json({ message: 'Ejercicio eliminado correctamente' });
  } catch (error) {
    console.error("Error al eliminar ejercicio:", error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
