import type { Request, Response } from 'express';
import { pool } from '../config/database.js';

export const crearPatologia = async (req: Request, res: Response) => {
  const { nombre, descripcion, nivel_gravedad } = req.body;

  try {

    const { rows: result }: any = await pool.query(
      `INSERT INTO patologias (nombre, descripcion, nivel_gravedad)
       VALUES ($1, $2, $3) RETURNING id`,
      [nombre, descripcion, nivel_gravedad]
    );

    res.status(201).json({
      message: 'Patología creada correctamente',
      id: result[0].id
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const obtenerPatologias = async (req: Request, res: Response) => {
  try {
    const { rows: patologias } = await pool.query('SELECT * FROM patologias WHERE activa = true ORDER BY fecha_creacion DESC');
    res.status(200).json(patologias);
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const obtenerEjerciciosPorPatologia = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const { rows: ejercicios } = await pool.query(
      `SELECT e.*
       FROM ejercicios e
       INNER JOIN patologia_ejercicios pe ON e.id = pe.ejercicio_id
       WHERE pe.patologia_id = $1
       AND e.activo = true`,
      [id]
    );
    res.status(200).json(ejercicios);
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const obtenerPatologiaPorId = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const { rows: patologia }: any = await pool.query('SELECT * FROM patologias WHERE id = $1', [id]);
    if (patologia.length === 0) {
      return res.status(404).json({ message: 'Patología no encontrada' });
    }
    res.status(200).json(patologia[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const actualizarPatologia = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nombre, descripcion, nivel_gravedad } = req.body;

  try {
    const result: any = await pool.query(
      `UPDATE patologias 
       SET nombre = $1, descripcion = $2, nivel_gravedad = $3
       WHERE id = $4`,
      [nombre, descripcion, nivel_gravedad, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Patología no encontrada' });
    }

    res.status(200).json({ message: 'Patología actualizada correctamente' });
  } catch (error) {
    console.error("Error al actualizar patología:", error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const eliminarPatologia = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    // Borrado lógico utilizando la columna 'activa' de la base de datos
    const result: any = await pool.query('UPDATE patologias SET activa = false WHERE id = $1', [id]);
    
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Patología no encontrada' });
    }

    res.status(200).json({ message: 'Patología eliminada correctamente' });
  } catch (error) {
    console.error("Error al eliminar patología:", error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};