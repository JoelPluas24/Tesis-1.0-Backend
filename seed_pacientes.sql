USE rehabilitacion_db;

-- PACIENTE 1: Martha González (68 años) → Regla: EDAD AVANZADA
-- Patología: Artrosis de Cadera
INSERT INTO pacientes (usuario_id, fisioterapeuta_id, edad, genero, direccion, fase_recuperacion, nivel_dolor, comorbilidades, nivel_actividad_fisica)
VALUES (14, 2, 68, 'F', 'Calle Flores 123', 'SUBAGUDA', 3, NULL, 'MODERADAMENTE_ACTIVO');

-- PACIENTE 2: Luis Torres (30 años) → Regla: FASE AGUDA
-- Patología: Tendinitis de Hombro
INSERT INTO pacientes (usuario_id, fisioterapeuta_id, edad, genero, direccion, fase_recuperacion, nivel_dolor, comorbilidades, nivel_actividad_fisica)
VALUES (15, 2, 30, 'M', 'Av. Principal 456', 'AGUDA', 4, NULL, 'ACTIVO');

-- PACIENTE 3: Ana Mendoza (45 años) → Regla: NIVEL DOLOR ALTO
-- Patología: Tendinitis de Hombro
INSERT INTO pacientes (usuario_id, fisioterapeuta_id, edad, genero, direccion, fase_recuperacion, nivel_dolor, comorbilidades, nivel_actividad_fisica)
VALUES (16, 2, 45, 'F', 'Calle Luna 789', 'SUBAGUDA', 8, NULL, 'MODERADAMENTE_ACTIVO');

-- PACIENTE 4: Pedro Salazar (55 años) → Regla: COMORBILIDAD CARDIACA
-- Patología: Artrosis de Cadera
INSERT INTO pacientes (usuario_id, fisioterapeuta_id, edad, genero, direccion, fase_recuperacion, nivel_dolor, comorbilidades, nivel_actividad_fisica)
VALUES (17, 2, 55, 'M', 'Av. Norte 101', 'SUBAGUDA', 3, '["CARDIACA","HIPERTENSION"]', 'MODERADAMENTE_ACTIVO');

-- PACIENTE 5: Carmen Vega (35 años) → Regla: FASE FORTALECIMIENTO
-- Patología: Tendinitis de Hombro
INSERT INTO pacientes (usuario_id, fisioterapeuta_id, edad, genero, direccion, fase_recuperacion, nivel_dolor, comorbilidades, nivel_actividad_fisica)
VALUES (18, 2, 35, 'F', 'Calle Sur 202', 'FORTALECIMIENTO', 1, NULL, 'ACTIVO');

-- PACIENTE 6: Roberto Flores (40 años) → Regla: VIDA SEDENTARIA
-- Patología: Artrosis de Cadera
INSERT INTO pacientes (usuario_id, fisioterapeuta_id, edad, genero, direccion, fase_recuperacion, nivel_dolor, comorbilidades, nivel_actividad_fisica)
VALUES (19, 2, 40, 'M', 'Av. Este 303', 'SUBAGUDA', 2, NULL, 'SEDENTARIO');

-- PACIENTE 7: Elena Paredes (72 años) → REGLAS MÚLTIPLES: Edad Avanzada + Fase Aguda + Dolor Alto + Cardíaca + Sedentaria
-- Patología: Artrosis de Cadera
INSERT INTO pacientes (usuario_id, fisioterapeuta_id, edad, genero, direccion, fase_recuperacion, nivel_dolor, comorbilidades, nivel_actividad_fisica)
VALUES (20, 2, 72, 'F', 'Calle Oeste 404', 'AGUDA', 7, '["CARDIACA"]', 'SEDENTARIO');
