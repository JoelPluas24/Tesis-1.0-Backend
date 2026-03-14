import type { Request, Response } from 'express';
import { pool } from '../config/database.js';

export const asignarPaciente = async (req: Request, res: Response) => {
  const { pacienteIds, fisioterapeutaId } = req.body;

  if (!Array.isArray(pacienteIds) || pacienteIds.length === 0) {
    return res.status(400).json({ message: 'Debe seleccionar al menos un paciente' });
  }

  try {
    // Verificar que el fisioterapeuta exista
    const [fisio]: any = await pool.query(
      `SELECT * FROM fisioterapeutas WHERE id = ?`,
      [fisioterapeutaId]
    );

    if (fisio.length === 0) {
      return res.status(404).json({ message: 'Fisioterapeuta no encontrado' });
    }

    // 2. Verificar si alguno de los pacientes ya tiene un fisioterapeuta asignado
    const [asignados]: any = await pool.query(
      `SELECT p.id, u.nombres, u.apellidos, p.fisioterapeuta_id 
       FROM pacientes p
       INNER JOIN usuarios u ON p.usuario_id = u.id
       WHERE p.id IN (?) AND p.fisioterapeuta_id IS NOT NULL`,
      [pacienteIds]
    );

    if (asignados.length > 0) {
      // Caso A: Si se intenta asignar al MISMO fisioterapeuta que ya tiene
      const mismoFisio = asignados.some((p: any) => p.fisioterapeuta_id === Number(fisioterapeutaId));

      if (mismoFisio) {
        const nombres = asignados
          .filter((p: any) => p.fisioterapeuta_id === Number(fisioterapeutaId))
          .map((p: any) => `${p.nombres} ${p.apellidos}`)
          .join(', ');

        return res.status(400).json({
          message: `El paciente (${nombres}) ya ha sido asignado a este fisioterapeuta anteriormente.`
        });
      }

      // Caso B: Si ya tiene otro fisioterapeuta diferente
      return res.status(400).json({
        message: 'Uno o más pacientes seleccionados ya tienen un fisioterapeuta asignado. Un paciente solo puede estar vinculado a un profesional a la vez.'
      });
    }

    // 3. Asignación Masiva usando IN (?)
    await pool.query(
      `UPDATE pacientes SET fisioterapeuta_id = ? WHERE id IN (?)`,
      [fisioterapeutaId, pacienteIds]
    );

    res.json({ message: 'Pacientes asignados correctamente' });

  } catch (error) {
    console.error('Error en asignarPaciente:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};




export const listarFisioterapeutas = async (req: Request, res: Response) => {
  try {

    const [rows] = await pool.query(`
      SELECT f.id,
             u.id as usuario_id,
             u.nombres,
             u.apellidos,
             u.email,
             u.activo,
             f.especialidad,
             f.telefono
      FROM fisioterapeutas f
      INNER JOIN usuarios u ON f.usuario_id = u.id
      WHERE u.activo = 1
    `);

    res.json(rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const actualizarFisioterapeuta = async (req: Request, res: Response) => {
  const { id } = req.params; // ID del fisioterapeuta
  const { nombres, apellidos, email, especialidad, telefono } = req.body;

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Obtener usuario_id del fisioterapeuta
    const [fisios]: any = await connection.query(`SELECT usuario_id FROM fisioterapeutas WHERE id = ?`, [id]);
    if (fisios.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: 'Fisioterapeuta no encontrado' });
    }
    const usuarioId = fisios[0].usuario_id;

    // Actualizar tabla usuarios
    await connection.query(
      `UPDATE usuarios SET nombres = ?, apellidos = ?, email = ? WHERE id = ?`,
      [nombres, apellidos, email, usuarioId]
    );

    // Actualizar tabla fisioterapeutas
    await connection.query(
      `UPDATE fisioterapeutas SET especialidad = ?, telefono = ? WHERE id = ?`,
      [especialidad, telefono, id]
    );

    await connection.commit();
    res.json({ message: 'Fisioterapeuta actualizado exitosamente' });

  } catch (error) {
    await connection.rollback();
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar fisioterapeuta', details: (error as any).message, stack: (error as any).stack });
  } finally {
    connection.release();
  }
};

export const eliminarFisioterapeuta = async (req: Request, res: Response) => {
  const { id } = req.params; // ID del fisioterapeuta

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Obtener usuario_id del fisioterapeuta
    const [fisios]: any = await connection.query(`SELECT usuario_id FROM fisioterapeutas WHERE id = ?`, [id]);
    if (fisios.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: 'Fisioterapeuta no encontrado' });
    }
    const usuarioId = fisios[0].usuario_id;

    // Baja lógica
    await connection.query(`UPDATE usuarios SET activo = 0 WHERE id = ?`, [usuarioId]);

    // Opcional: Desasignar a todos los pacientes asignados a este fisioterapeuta
    await connection.query(`UPDATE pacientes SET fisioterapeuta_id = NULL WHERE fisioterapeuta_id = ?`, [id]);

    await connection.commit();
    res.json({ message: 'Fisioterapeuta dado de baja correctamente' });

  } catch (error) {
    await connection.rollback();
    console.error(error);
    res.status(500).json({ message: 'Error al dar de baja al fisioterapeuta' });
  } finally {
    connection.release();
  }
};

export const listarPacientes = async (req: Request, res: Response) => {
  try {

    const [rows] = await pool.query(`
      SELECT p.id,
             u.id as usuario_id,
             u.nombres,
             u.apellidos,
             u.email,
             u.activo,
             p.edad,
             p.genero,
             p.direccion,
             p.fisioterapeuta_id
      FROM pacientes p
      INNER JOIN usuarios u ON p.usuario_id = u.id
      WHERE u.activo = 1
    `);

    res.json(rows);

  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const actualizarPaciente = async (req: Request, res: Response) => {
  const { id } = req.params; // ID del paciente
  const { nombres, apellidos, email, edad, genero, direccion } = req.body;

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Obtener usuario_id del paciente
    const [pacientes]: any = await connection.query(`SELECT usuario_id FROM pacientes WHERE id = ?`, [id]);
    if (pacientes.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: 'Paciente no encontrado' });
    }
    const usuarioId = pacientes[0].usuario_id;

    // Actualizar tabla usuarios
    await connection.query(
      `UPDATE usuarios SET nombres = ?, apellidos = ?, email = ? WHERE id = ?`,
      [nombres, apellidos, email, usuarioId]
    );

    // Actualizar tabla pacientes
    await connection.query(
      `UPDATE pacientes SET edad = ?, genero = ?, direccion = ? WHERE id = ?`,
      [edad, genero, direccion, id]
    );

    await connection.commit();
    res.json({ message: 'Paciente actualizado exitosamente' });

  } catch (error) {
    await connection.rollback();
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar paciente', details: (error as any).message, stack: (error as any).stack });
  } finally {
    connection.release();
  }
};

export const eliminarPaciente = async (req: Request, res: Response) => {
  const { id } = req.params; // ID del paciente

  try {
    // Obtener usuario_id del paciente
    const [pacientes]: any = await pool.query(`SELECT usuario_id FROM pacientes WHERE id = ?`, [id]);

    if (pacientes.length === 0) {
      return res.status(404).json({ message: 'Paciente no encontrado' });
    }
    const usuarioId = pacientes[0].usuario_id;

    // Baja lógica
    await pool.query(`UPDATE usuarios SET activo = 0 WHERE id = ?`, [usuarioId]);

    // Opcional: Desasignar al fisioterapeuta para limpiar la lista del fisio
    await pool.query(`UPDATE pacientes SET fisioterapeuta_id = NULL WHERE id = ?`, [id]);

    res.json({ message: 'Paciente dado de baja correctamente' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al dar de baja al paciente' });
  }
};

export const reporteGeneral = async (req: Request, res: Response) => {
  try {

    const [pacientes]: any = await pool.query(
      `SELECT COUNT(*) as total FROM pacientes`
    );

    const [fisios]: any = await pool.query(
      `SELECT COUNT(*) as total FROM usuarios 
       WHERE rol = 'FISIOTERAPEUTA'`
    );

    const [rutinas]: any = await pool.query(
      `SELECT COUNT(*) as total FROM rutinas 
       WHERE activa = 1`
    );

    const [cumplimiento]: any = await pool.query(
      `SELECT COUNT(*) as total FROM cumplimiento_ejercicios`
    );

    res.json({
      total_pacientes: pacientes[0].total,
      total_fisioterapeutas: fisios[0].total,
      rutinas_activas: rutinas[0].total,
      ejercicios_realizados: cumplimiento[0].total
    });

  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};