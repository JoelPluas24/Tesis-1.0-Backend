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

    const [result]: any = await pool.query(
      `INSERT INTO ejercicios
       (nombre, descripcion, indicaciones, contraindicaciones, nivel_dificultad, video_url)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nombre, descripcion, indicaciones, contraindicaciones, nivel_dificultad, video_url]
    );

    res.status(201).json({
      message: 'Ejercicio creado correctamente',
      id: result.insertId
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
    await pool.query('DELETE FROM patologia_ejercicios WHERE patologia_id = ?', [patologia_id]);

    if (!ejercicios_ids || ejercicios_ids.length === 0) {
      return res.status(200).json({ message: 'Asociaciones actualizadas (vacío)' });
    }

    // Preparamos los valores para la inserción masiva
    const values = ejercicios_ids.map((id: number) => [patologia_id, id]);
    
    await pool.query(
      `INSERT INTO patologia_ejercicios (patologia_id, ejercicio_id) VALUES ?`,
      [values]
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
    const [ejercicios] = await pool.query('SELECT * FROM ejercicios WHERE activo = 1 ORDER BY fecha_creacion DESC');
    res.status(200).json(ejercicios);
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const obtenerEjercicioPorId = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const [ejercicio]: any = await pool.query('SELECT * FROM ejercicios WHERE id = ?', [id]);
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
    const [result]: any = await pool.query(
      `UPDATE ejercicios 
       SET nombre = ?, descripcion = ?, indicaciones = ?, contraindicaciones = ?, nivel_dificultad = ?, video_url = ?
       WHERE id = ?`,
      [nombre, descripcion, indicaciones, contraindicaciones, nivel_dificultad, video_url, id]
    );

    if (result.affectedRows === 0) {
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
    const [result]: any = await pool.query('UPDATE ejercicios SET activo = 0 WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Ejercicio no encontrado' });
    }

    res.status(200).json({ message: 'Ejercicio eliminado correctamente' });
  } catch (error) {
    console.error("Error al eliminar ejercicio:", error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
