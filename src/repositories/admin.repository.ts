import { pool } from '../config/database.js';

export class AdminRepository {
  static async getFisioterapeutaById(id: number) {
    const [rows]: any = await pool.query(
      `SELECT * FROM fisioterapeutas WHERE id = ?`,
      [id]
    );
    return rows[0];
  }

  static async getAssignedPacientes(fisioterapeutaId: number, pacienteIds: number[]) {
    const [rows]: any = await pool.query(
      `SELECT p.id, u.nombres, u.apellidos, p.fisioterapeuta_id 
       FROM pacientes p
       INNER JOIN usuarios u ON p.usuario_id = u.id
       WHERE p.id IN (?) AND p.fisioterapeuta_id IS NOT NULL`,
      [pacienteIds]
    );
    return rows;
  }

  static async assignPacientesToFisioterapeuta(fisioterapeutaId: number, pacienteIds: number[]) {
    await pool.query(
      `UPDATE pacientes SET fisioterapeuta_id = ? WHERE id IN (?)`,
      [fisioterapeutaId, pacienteIds]
    );
  }

  static async getFisioterapeutasList() {
    const [rows] = await pool.query(`
      SELECT f.id, u.id as usuario_id, u.nombres, u.apellidos, u.email, u.activo, f.especialidad, f.telefono
      FROM fisioterapeutas f
      INNER JOIN usuarios u ON f.usuario_id = u.id
      WHERE u.activo = 1
    `);
    return rows;
  }

  static async getFisioterapeutaUserId(id: number, connection: any) {
    const [rows]: any = await connection.query(`SELECT usuario_id FROM fisioterapeutas WHERE id = ?`, [id]);
    return rows[0]?.usuario_id;
  }

  static async updateUsuario(id: number, nombres: string, apellidos: string, email: string, connection: any) {
    await connection.query(
      `UPDATE usuarios SET nombres = ?, apellidos = ?, email = ? WHERE id = ?`,
      [nombres, apellidos, email, id]
    );
  }

  static async updateFisioterapeuta(id: number, especialidad: string, telefono: string, connection: any) {
    await connection.query(
      `UPDATE fisioterapeutas SET especialidad = ?, telefono = ? WHERE id = ?`,
      [especialidad, telefono, id]
    );
  }

  static async removeUsuario(id: number, connection: any) {
    await connection.query(`UPDATE usuarios SET activo = 0 WHERE id = ?`, [id]);
  }

  static async unassignPatientsFromFisioterapeuta(fisioterapeutaId: number, connection: any) {
    await connection.query(`UPDATE pacientes SET fisioterapeuta_id = NULL WHERE fisioterapeuta_id = ?`, [fisioterapeutaId]);
  }

  static async getPacientesList() {
    const [rows] = await pool.query(`
      SELECT p.id, u.id as usuario_id, u.nombres, u.apellidos, u.email, u.activo, p.edad, p.genero, p.direccion, p.fisioterapeuta_id
      FROM pacientes p
      INNER JOIN usuarios u ON p.usuario_id = u.id
      WHERE u.activo = 1
    `);
    return rows;
  }

  static async getPacientesInactivosList() {
    const [rows] = await pool.query(`
      SELECT p.id, u.id as usuario_id, u.nombres, u.apellidos, u.email, u.activo, p.edad, p.genero, p.direccion, p.fisioterapeuta_id
      FROM pacientes p
      INNER JOIN usuarios u ON p.usuario_id = u.id
      WHERE u.activo = 0
    `);
    return rows;
  }

  static async getPacienteUserId(id: number, connection: any) {
    const [rows]: any = await connection.query(`SELECT usuario_id FROM pacientes WHERE id = ?`, [id]);
    return rows[0]?.usuario_id;
  }

  static async updatePaciente(id: number, edad: number, genero: string, direccion: string, connection: any) {
    await connection.query(
      `UPDATE pacientes SET edad = ?, genero = ?, direccion = ? WHERE id = ?`,
      [edad, genero, direccion, id]
    );
  }

  static async getPacienteUserIdWithoutConnection(id: number) {
    const [rows]: any = await pool.query(`SELECT usuario_id FROM pacientes WHERE id = ?`, [id]);
    return rows[0]?.usuario_id;
  }

  static async removeUsuarioWithoutConnection(id: number) {
    await pool.query(`UPDATE usuarios SET activo = 0 WHERE id = ?`, [id]);
  }

  static async reactivarUsuarioWithoutConnection(id: number) {
    await pool.query(`UPDATE usuarios SET activo = 1 WHERE id = ?`, [id]);
  }

  static async reactivarUsuario(id: number, connection: any) {
    await connection.query(`UPDATE usuarios SET activo = 1 WHERE id = ?`, [id]);
  }

  static async unassignFisioterapeutaFromPaciente(id: number) {
    await pool.query(`UPDATE pacientes SET fisioterapeuta_id = NULL WHERE id = ?`, [id]);
  }

  static async getGeneralReport(fechaInicio?: string, fechaFin?: string) {
    let dateFilterCumplimiento = '';
    let dateFilterRutina = '';
    let params: any[] = [];

    if (fechaInicio && fechaFin) {
      dateFilterCumplimiento = 'WHERE fecha >= ? AND fecha <= ?';
      dateFilterRutina = 'AND fecha_inicio >= ? AND fecha_inicio <= ?';
      params = [fechaInicio, fechaFin];
    } else if (fechaInicio) {
      dateFilterCumplimiento = 'WHERE fecha >= ?';
      dateFilterRutina = 'AND fecha_inicio >= ?';
      params = [fechaInicio];
    } else if (fechaFin) {
      dateFilterCumplimiento = 'WHERE fecha <= ?';
      dateFilterRutina = 'AND fecha_inicio <= ?';
      params = [fechaFin];
    }

    const [pacientes]: any = await pool.query(`SELECT COUNT(*) as total FROM pacientes`);
    const [fisios]: any = await pool.query(`SELECT COUNT(*) as total FROM usuarios WHERE rol = 'FISIOTERAPEUTA'`);
    const [rutinas]: any = await pool.query(`SELECT COUNT(*) as total FROM rutinas WHERE activa = 1 ${dateFilterRutina}`, params);
    const [cumplimiento]: any = await pool.query(`SELECT COUNT(*) as total FROM cumplimiento_ejercicios ${dateFilterCumplimiento}`, params);
    
    return {
      total_pacientes: pacientes[0].total,
      total_fisioterapeutas: fisios[0].total,
      rutinas_activas: rutinas[0].total,
      ejercicios_realizados: cumplimiento[0].total
    };
  }
}
