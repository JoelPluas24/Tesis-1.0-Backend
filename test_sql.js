import { pool } from './src/config/database.js';

async function test() {
  try {
    const paciente_id = 1; // Ajusta esto si conoces un ID válido, o usa uno genérico
    const [ejercicios]: any = await pool.query(
      `SELECT DISTINCT e.id, e.nombre, e.descripcion, e.video_url,
               re.series, re.repeticiones, re.frecuencia
       FROM rutina_ejercicios re
       INNER JOIN ejercicios e ON re.ejercicio_id = e.id
       INNER JOIN rutinas r ON re.rutina_id = r.id
       WHERE r.paciente_id = ?`,
      [paciente_id]
    );
    console.log('Result:', ejercicios);
  } catch (error) {
    console.error('SQL Error:', error);
  } finally {
    process.exit();
  }
}

test();
