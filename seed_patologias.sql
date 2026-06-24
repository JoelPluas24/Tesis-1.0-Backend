USE rehabilitacion_db;

-- Obtener IDs de pacientes recién creados
-- Martha=último paciente con usuario_id=14, etc.

-- Asignar patologías
-- Martha (Artrosis Cadera - patologia 11)
INSERT INTO paciente_patologias (paciente_id, patologia_id, fecha_diagnostico) 
SELECT p.id, 11, CURDATE() FROM pacientes p WHERE p.usuario_id = 14;

-- Luis (Tendinitis de Hombro - patologia 10)
INSERT INTO paciente_patologias (paciente_id, patologia_id, fecha_diagnostico) 
SELECT p.id, 10, CURDATE() FROM pacientes p WHERE p.usuario_id = 15;

-- Ana (Tendinitis de Hombro - patologia 10)
INSERT INTO paciente_patologias (paciente_id, patologia_id, fecha_diagnostico) 
SELECT p.id, 10, CURDATE() FROM pacientes p WHERE p.usuario_id = 16;

-- Pedro (Artrosis de Cadera - patologia 11)
INSERT INTO paciente_patologias (paciente_id, patologia_id, fecha_diagnostico) 
SELECT p.id, 11, CURDATE() FROM pacientes p WHERE p.usuario_id = 17;

-- Carmen (Tendinitis de Hombro - patologia 10)
INSERT INTO paciente_patologias (paciente_id, patologia_id, fecha_diagnostico) 
SELECT p.id, 10, CURDATE() FROM pacientes p WHERE p.usuario_id = 18;

-- Roberto (Artrosis de Cadera - patologia 11)
INSERT INTO paciente_patologias (paciente_id, patologia_id, fecha_diagnostico) 
SELECT p.id, 11, CURDATE() FROM pacientes p WHERE p.usuario_id = 19;

-- Elena (Artrosis de Cadera - patologia 11)
INSERT INTO paciente_patologias (paciente_id, patologia_id, fecha_diagnostico) 
SELECT p.id, 11, CURDATE() FROM pacientes p WHERE p.usuario_id = 20;
