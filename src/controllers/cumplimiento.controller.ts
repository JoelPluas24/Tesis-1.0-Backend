import type { Request, Response } from 'express';
import { pool } from '../config/database.js';

export const registrarCumplimiento = async (req: Request, res: Response) => {
  const { ejercicio_id } = req.body;
  const usuario_id = (req as any).user.id;

  try {

    // Buscar el paciente asociado al usuario logueado
    const { rows: paciente }: any = await pool.query(
      `SELECT id FROM pacientes WHERE usuario_id = $1`,
      [usuario_id]
    );

    if (paciente.length === 0) {
      return res.status(404).json({ message: 'Paciente no encontrado' });
    }

    const paciente_id = paciente[0].id;

    // VALIDACIÓN: ¿Ya completó este ejercicio hoy?
    const { rows: existente }: any = await pool.query(
      `SELECT id FROM cumplimiento_ejercicios 
       WHERE paciente_id = $1 AND ejercicio_id = $2 AND fecha = CURRENT_DATE`,
      [paciente_id, ejercicio_id]
    );

    if (existente.length > 0) {
      return res.status(200).json({ 
        message: 'El ejercicio ya fue completado hoy',
        altaMedica: false // Asumimos que si ya estaba registrado, la lógica de alta ya corrió o no aplica
      });
    }

    await pool.query(
      `INSERT INTO cumplimiento_ejercicios 
       (paciente_id, ejercicio_id, fecha, completado)
       VALUES ($1, $2, CURRENT_DATE, true)`,
      [paciente_id, ejercicio_id]
    );

    // ---- INICIO DE LÓGICA DE ALTA MÉDICA AUTOMÁTICA ----
    // 1. Encontrar la rutina activa primero para sacar los totales
    const { rows: rutina }: any = await pool.query(
      `SELECT id FROM rutinas WHERE paciente_id = $1 AND activa = true`,
      [paciente_id]
    );

    let altaMedica = false;

    if (rutina.length > 0) {
      const rutinaId = rutina[0].id;
      // 2. Cantidad de ejercicios en la rutina
      const { rows: totalResult }: any = await pool.query(
        `SELECT COUNT(*) as total FROM rutina_ejercicios WHERE rutina_id = $1`,
        [rutinaId]
      );
      const total_ejercicios = totalResult[0].total;

      // 3. Cantidad de distintos ejercicios que se han marcado realizados de ESA rutina
      const { rows: realizadosResult }: any = await pool.query(
        `SELECT COUNT(DISTINCT c.ejercicio_id) as realizados
         FROM cumplimiento_ejercicios c
         INNER JOIN rutina_ejercicios re ON c.ejercicio_id = re.ejercicio_id
         WHERE c.paciente_id = $1 AND re.rutina_id = $2`,
        [paciente_id, rutinaId]
      );
      const ejercicios_realizados = realizadosResult[0].realizados;

      const porcentaje_cumplimiento = total_ejercicios > 0
        ? Math.round((ejercicios_realizados / total_ejercicios) * 100)
        : 0;

      // 4. Regla de Alta Médica (100% de Cumplimiento)
      if (porcentaje_cumplimiento >= 100) {
        altaMedica = true;
        // Baja Lógica (Alta Médica Exitosa): El paciente ya no requiere seguir y libera el cupo.
        await pool.query(`UPDATE usuarios SET activo = false WHERE id = $1`, [usuario_id]);
        
        // Liberar al fisioterapeuta de la responsabilidad y desactivar la rutina completada
        await pool.query(`UPDATE pacientes SET fisioterapeuta_id = NULL WHERE id = $1`, [paciente_id]);
        await pool.query(`UPDATE rutinas SET activa = false WHERE id = $1`, [rutinaId]);
      }
    }
    // ---- FIN DE LÓGICA DE ALTA MÉDICA AUTOMÁTICA ----

    res.status(201).json({
      message: 'Cumplimiento registrado correctamente',
      altaMedica: altaMedica
    });

  } catch (error) {
    console.log(error); // <-- importante para debug
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const verProgresoPaciente = async (req: Request, res: Response) => {
  const { paciente_id } = req.params;

  try {

    // 1. Encontrar la rutina activa primero para sacar los totales
    const { rows: rutina }: any = await pool.query(
      `SELECT id FROM rutinas WHERE paciente_id = $1 AND activa = true`,
      [paciente_id]
    );

    if (rutina.length === 0) {
      return res.json({
        paciente_id,
        progreso: [],
        total_ejercicios: 0,
        ejercicios_realizados: 0,
        porcentaje_cumplimiento: 0
      });
    }

    const rutinaId = rutina[0].id;

    // 2. Obtener la tabla base de progreso
    const { rows: progreso }: any = await pool.query(
      `SELECT 
        e.nombre,
        COUNT(c.id) AS veces_realizado
       FROM cumplimiento_ejercicios c
       INNER JOIN ejercicios e ON c.ejercicio_id = e.id
       WHERE c.paciente_id = $1
       GROUP BY e.nombre`,
      [paciente_id]
    );

    // 3. Cantidad de ejercicios en la rutina
    const { rows: totalResult }: any = await pool.query(
      `SELECT COUNT(*) as total FROM rutina_ejercicios WHERE rutina_id = $1`,
      [rutinaId]
    );
    const total_ejercicios = totalResult[0].total;

    // 4. Cantidad de distintos ejercicios que se han marcado realizados de ESA rutina
    const { rows: realizadosResult }: any = await pool.query(
      `SELECT COUNT(DISTINCT c.ejercicio_id) as realizados
       FROM cumplimiento_ejercicios c
       INNER JOIN rutina_ejercicios re ON c.ejercicio_id = re.ejercicio_id
       WHERE c.paciente_id = $1 AND re.rutina_id = $2`,
      [paciente_id, rutinaId]
    );
    const ejercicios_realizados = realizadosResult[0].realizados;

    // 5. Porcentaje
    const porcentaje_cumplimiento = total_ejercicios > 0
      ? Math.round((ejercicios_realizados / total_ejercicios) * 100)
      : 0;

    res.json({
      paciente_id,
      progreso,
      total_ejercicios,
      ejercicios_realizados,
      porcentaje_cumplimiento
    });

  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

