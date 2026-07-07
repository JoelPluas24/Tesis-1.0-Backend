import mysql from 'mysql2/promise';

async function alterDb() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    port: 3307,
    user: 'root',
    password: 'Joelpluas24.',
    database: 'rehabilitacion_db'
  });

  try {
    console.log("Connected. Altering table...");
    await connection.query('ALTER TABLE cumplimiento_ejercicios ADD COLUMN rutina_id INT DEFAULT NULL');
    console.log("Column added.");
    await connection.query('ALTER TABLE cumplimiento_ejercicios ADD CONSTRAINT fk_rutina_cumplimiento FOREIGN KEY (rutina_id) REFERENCES rutinas(id) ON DELETE CASCADE');
    console.log("Constraint added.");
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await connection.end();
  }
}

alterDb();
