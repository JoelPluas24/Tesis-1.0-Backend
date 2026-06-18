import { pool } from '../config/database.js';

export class RutinaRepository {
  static async deactivateRutinasPrevias(pacienteId: number, connection: any) {
    await connection.query(
      `UPDATE rutinas SET activa = 0 WHERE paciente_id = ? AND activa = 1`,
      [pacienteId]
    );
  }

  static async createRutina(data: any, connection: any) {
    const { paciente_id, fisioterapeuta_id, fecha_inicio, fecha_fin, observaciones } = data;
    
    // Buscar la patología activa del paciente
    const [patologias]: any = await connection.query(
      `SELECT patologia_id FROM paciente_patologias WHERE paciente_id = ? LIMIT 1`,
      [paciente_id]
    );
    const patologia_id = patologias.length > 0 ? patologias[0].patologia_id : null;

    // Obtener la fotografía clínica del paciente en este momento
    const [pacientesInfo]: any = await connection.query(
      `SELECT fase_recuperacion, nivel_dolor, comorbilidades, nivel_actividad_fisica FROM pacientes WHERE id = ?`,
      [paciente_id]
    );
    const pInfo = pacientesInfo[0] || {};
    const { fase_recuperacion, nivel_dolor, comorbilidades, nivel_actividad_fisica } = pInfo;

    const [result]: any = await connection.query(
      `INSERT INTO rutinas (paciente_id, fisioterapeuta_id, fecha_inicio, fecha_fin, observaciones, patologia_id, fase_recuperacion, nivel_dolor, comorbilidades, nivel_actividad_fisica)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [paciente_id, fisioterapeuta_id, fecha_inicio, fecha_fin, observaciones, patologia_id, fase_recuperacion, nivel_dolor, comorbilidades ? JSON.stringify(comorbilidades) : null, nivel_actividad_fisica]
    );
    return result.insertId;
  }

  static async addEjerciciosToRutina(rutinaId: number, ejercicios: any[], connection: any) {
    for (const ejercicio of ejercicios) {
      await connection.query(
        `INSERT INTO rutina_ejercicios 
         (rutina_id, ejercicio_id, series, repeticiones, frecuencia)
         VALUES (?, ?, ?, ?, ?)`,
        [rutinaId, ejercicio.ejercicio_id, ejercicio.series, ejercicio.repeticiones, ejercicio.frecuencia]
      );
    }
  }

  static async getRutinaActiva(pacienteId: number) {
    const [rutina]: any = await pool.query(
      `SELECT * FROM rutinas WHERE paciente_id = ? AND activa = 1`,
      [pacienteId]
    );
    return rutina[0];
  }

  static async getEjerciciosByRutina(rutinaId: number) {
    const [ejercicios]: any = await pool.query(
      `SELECT e.id, e.nombre, e.descripcion, e.video_url,
              re.series, re.repeticiones, re.frecuencia
       FROM rutina_ejercicios re
       INNER JOIN ejercicios e ON re.ejercicio_id = e.id
       WHERE re.rutina_id = ?`,
      [rutinaId]
    );
    return ejercicios;
  }

  static async getTodosEjerciciosPaciente(pacienteId: number, fechaLocal?: string) {
    const fecha = fechaLocal || new Intl.DateTimeFormat('sv-SE', { timeZone: 'America/Guayaquil' }).format(new Date());
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
               AND c.fecha = ?) AS vecesCompletadasHoy
       FROM rutina_ejercicios re
       INNER JOIN ejercicios e ON re.ejercicio_id = e.id
       INNER JOIN rutinas r ON re.rutina_id = r.id
       WHERE r.paciente_id = ? AND r.activa = 1
       ORDER BY r.fecha_creacion DESC`,
      [fecha, pacienteId]
    );
    return ejercicios;
  }

  static async getHistorialRutinas(pacienteId: number) {
    const [rutinas]: any = await pool.query(
      `SELECT r.id, r.fecha_inicio, r.fecha_fin, r.observaciones, r.activa, r.fecha_creacion,
              r.fase_recuperacion, r.nivel_dolor, r.comorbilidades, r.nivel_actividad_fisica,
              p.nombre as patologia_nombre, p.descripcion as patologia_descripcion, p.nivel_gravedad as patologia_gravedad,
              (SELECT COUNT(*) FROM rutina_ejercicios re WHERE re.rutina_id = r.id) as total_ejercicios,
              (SELECT COUNT(*) FROM cumplimiento_ejercicios c 
               INNER JOIN rutina_ejercicios re ON c.ejercicio_id = re.ejercicio_id 
               WHERE re.rutina_id = r.id AND c.paciente_id = r.paciente_id 
               AND c.fecha >= r.fecha_inicio AND c.fecha <= IFNULL(r.fecha_fin, CURDATE())) as total_completados
       FROM rutinas r
       LEFT JOIN patologias p ON r.patologia_id = p.id
       WHERE r.paciente_id = ? AND r.activa = 0
       ORDER BY r.fecha_creacion DESC`,
      [pacienteId]
    );

    for (const r of rutinas) {
      if (r.fecha_inicio && r.fecha_fin) {
         const msPerDay = 1000 * 60 * 60 * 24;
         const diffTime = Math.abs(new Date(r.fecha_fin).getTime() - new Date(r.fecha_inicio).getTime());
         const diffDays = Math.ceil(diffTime / msPerDay) + 1;
         const expected = diffDays * (r.total_ejercicios || 0);
         r.porcentaje = expected > 0 ? Math.round((r.total_completados / expected) * 100) : 0;
         if(r.porcentaje > 100) r.porcentaje = 100;
      } else {
         r.porcentaje = 0;
      }
    }

    return rutinas;
  }

  static async updateRutina(rutinaId: number, data: any, connection: any) {
    const { fecha_inicio, fecha_fin, observaciones } = data;
    await connection.query(
      `UPDATE rutinas SET fecha_inicio = ?, fecha_fin = ?, observaciones = ? WHERE id = ?`,
      [fecha_inicio, fecha_fin, observaciones, rutinaId]
    );
  }

  static async finalizarRutina(rutinaId: number) {
    await pool.query(
      `UPDATE rutinas SET activa = 0 WHERE id = ?`,
      [rutinaId]
    );
  }

  static async deleteEjerciciosFromRutina(rutinaId: number, connection: any) {
    await connection.query(
      `DELETE FROM rutina_ejercicios WHERE rutina_id = ?`,
      [rutinaId]
    );
  }

  static async deleteRutina(rutinaId: number, connection: any) {
    await connection.query(
      `DELETE FROM rutinas WHERE id = ?`,
      [rutinaId]
    );
  }
}
