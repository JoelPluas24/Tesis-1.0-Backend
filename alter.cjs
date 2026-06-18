const mysql = require('mysql2/promise');

async function run() {
  const conn = await mysql.createConnection({
    host: 'localhost',
    port: 3307,
    user: 'root',
    password: 'Joelpluas24.',
    database: 'rehabilitacion_db'
  });

  await conn.query(`
    ALTER TABLE rutinas 
    ADD COLUMN fase_recuperacion ENUM('AGUDA','SUBAGUDA','FORTALECIMIENTO','ALTA') DEFAULT 'AGUDA', 
    ADD COLUMN nivel_dolor INT, 
    ADD COLUMN comorbilidades JSON, 
    ADD COLUMN nivel_actividad_fisica ENUM('SEDENTARIO','MODERADAMENTE_ACTIVO','ACTIVO','DEPORTISTA');
  `);
  console.log('Columns added successfully');
  await conn.end();
}

run().catch(console.error);
