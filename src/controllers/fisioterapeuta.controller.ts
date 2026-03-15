import type { Request, Response } from 'express';
import { pool } from '../config/database.js';

export const listarPacientesAsignados = async (req: Request, res: Response) => {

  const usuario_id = (req as any).user.id;

  try {
    // Primero, obtener el ID del fisioterapeuta correspondiente al usuario_id (del token)
    const { rows: fisioterapeutas }: any = await pool.query(
      `SELECT id FROM fisioterapeutas WHERE usuario_id = $1`,
      [usuario_id]
    );

    if (fisioterapeutas.length === 0) {
      return res.status(404).json({ message: 'Fisioterapeuta no encontrado' });
    }

    const fisioterapeuta_id = fisioterapeutas[0].id;

    // Luego, obtener los pacientes asignados a ese fisioterapeuta
    const { rows: pacientes }: any = await pool.query(
      `SELECT p.id, u.nombres, u.apellidos, u.email, p.edad, p.genero, p.fase_recuperacion
       FROM pacientes p
       INNER JOIN usuarios u ON p.usuario_id = u.id
       WHERE p.fisioterapeuta_id = $1`,
      [fisioterapeuta_id]
    );

    res.json({
      pacientes
    });

  } catch (error) {
    console.error('Error en listarPacientesAsignados:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const verPatologiaPaciente = async (req: Request, res: Response) => {
  const { paciente_id } = req.params;

  try {
    const { rows: patologias }: any = await pool.query(
      `SELECT p.id, p.nombre, p.descripcion, p.nivel_gravedad 
       FROM patologias p
       INNER JOIN paciente_patologias pp ON p.id = pp.patologia_id
       WHERE pp.paciente_id = $1`,
      [paciente_id]
    );

    res.json(patologias);
  } catch (error) {
    console.error('Error al ver patología del paciente:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const asignarPatologiaPaciente = async (req: Request, res: Response) => {
  const { paciente_id } = req.params;
  const { patologia_ids } = req.body; // Un array de IDs de patologías

  try {
    // 1. Limpiar patologías anteriores (si las hubiera, o permitir reemplazo total)
    await pool.query('DELETE FROM paciente_patologias WHERE paciente_id = $1', [paciente_id]);

    if (!patologia_ids || patologia_ids.length === 0) {
      return res.json({ message: 'Se eliminaron las patologías del paciente.' });
    }

    // 2. Insertar las nuevas patologías
    const placeholders = patologia_ids.map((_: any, i: number) => `($1, $${i + 2})`).join(', ');
    
    await pool.query(
      `INSERT INTO paciente_patologias (paciente_id, patologia_id) VALUES ${placeholders}`,
      [paciente_id, ...patologia_ids]
    );

    res.json({ message: 'Patología(s) asignada(s) correctamente al paciente.' });
  } catch (error) {
    console.error('Error al asignar patología:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};