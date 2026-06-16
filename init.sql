CREATE DATABASE IF NOT EXISTS rehabilitacion_db;
USE rehabilitacion_db;

CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    rol ENUM('ADMIN', 'FISIOTERAPEUTA', 'PACIENTE') NOT NULL,
    activo TINYINT(1) DEFAULT 1,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS fisioterapeutas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    especialidad VARCHAR(100),
    telefono VARCHAR(20),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS pacientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    fisioterapeuta_id INT,
    edad INT,
    genero ENUM('M', 'F'),
    direccion VARCHAR(200),
    fase_recuperacion ENUM('AGUDA', 'SUBAGUDA', 'FORTALECIMIENTO', 'ALTA') DEFAULT 'AGUDA',
    nivel_dolor TINYINT DEFAULT 0,
    comorbilidades JSON DEFAULT NULL,
    nivel_actividad_fisica VARCHAR(30) DEFAULT 'SEDENTARIO',
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (fisioterapeuta_id) REFERENCES fisioterapeutas(id)
);

CREATE TABLE IF NOT EXISTS patologias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    nivel_gravedad ENUM('LEVE','MODERADA','SEVERA') NOT NULL,
    activa TINYINT(1) DEFAULT 1,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS paciente_patologias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    paciente_id INT NOT NULL,
    patologia_id INT NOT NULL,
    fecha_diagnostico DATE,
    observaciones TEXT,
    FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE CASCADE,
    FOREIGN KEY (patologia_id) REFERENCES patologias(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ejercicios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    indicaciones TEXT,
    contraindicaciones TEXT,
    nivel_dificultad ENUM('BAJO','MEDIO','ALTO') NOT NULL,
    video_url VARCHAR(255),
    activo TINYINT(1) DEFAULT 1,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS patologia_ejercicios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patologia_id INT NOT NULL,
    ejercicio_id INT NOT NULL,
    FOREIGN KEY (patologia_id) REFERENCES patologias(id) ON DELETE CASCADE,
    FOREIGN KEY (ejercicio_id) REFERENCES ejercicios(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS rutinas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    paciente_id INT NOT NULL,
    fisioterapeuta_id INT NOT NULL,
    patologia_id INT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE,
    observaciones TEXT,
    activa TINYINT(1) DEFAULT 1,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE CASCADE,
    FOREIGN KEY (fisioterapeuta_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS rutina_ejercicios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rutina_id INT NOT NULL,
    ejercicio_id INT NOT NULL,
    series INT NOT NULL,
    repeticiones INT NOT NULL,
    frecuencia VARCHAR(100),
    FOREIGN KEY (rutina_id) REFERENCES rutinas(id) ON DELETE CASCADE,
    FOREIGN KEY (ejercicio_id) REFERENCES ejercicios(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS cumplimiento_ejercicios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    paciente_id INT NOT NULL,
    ejercicio_id INT NOT NULL,
    fecha DATE NOT NULL,
    completado TINYINT(1) DEFAULT 1,
    FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE CASCADE,
    FOREIGN KEY (ejercicio_id) REFERENCES ejercicios(id) ON DELETE CASCADE
);
