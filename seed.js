import bcrypt from 'bcryptjs';
import mysql from 'mysql2/promise';

async function seed() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    port: 3307, // Express connects to db on 3306, but from host we connect to 3307 based on docker-compose!
    user: 'root',
    password: 'Joelpluas24.',
    database: 'rehabilitacion_db'
  });

  const hash = await bcrypt.hash('123456', 10);

  // Insert Admin
  await connection.query(`INSERT INTO usuarios (nombres, apellidos, email, password_hash, rol, activo) VALUES (?, ?, ?, ?, 'ADMIN', 1)`, 
    ['Admin', 'Principal', 'admin@admin.com', hash]);

  // Insert Fisio
  const [result] = await connection.query(`INSERT INTO usuarios (nombres, apellidos, email, password_hash, rol, activo) VALUES (?, ?, ?, ?, 'FISIOTERAPEUTA', 1)`, 
    ['Fisio', 'Prueba', 'fisio@fisio.com', hash]);
    
  await connection.query(`INSERT INTO fisioterapeutas (usuario_id, especialidad, telefono) VALUES (?, ?, ?)`, 
    [result.insertId, 'Rehabilitación Deportiva', '0999999999']);

  console.log('Seed exitoso: admin@admin.com / 123456 | fisio@fisio.com / 123456');
  await connection.end();
}

seed().catch(console.error);
