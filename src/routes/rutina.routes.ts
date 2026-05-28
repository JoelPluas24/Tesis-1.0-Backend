import { Router } from 'express';
import { crearRutina, obtenerRutinaActiva, obtenerHistorialRutinas, obtenerTodosLosEjerciciosPaciente, obtenerEjerciciosPorRutina, editarRutina, eliminarRutina } from '../controllers/rutina.controller.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';
import { authorizeRole } from '../middlewares/authorizeRole.js';
import { UserRole } from '../types/roles.js';

const router = Router();

router.post(
  '/',
  authenticateToken,
  authorizeRole([UserRole.FISIOTERAPEUTA]),
  crearRutina
);

router.put(
  '/:id',
  authenticateToken,
  authorizeRole([UserRole.FISIOTERAPEUTA]),
  editarRutina
);

router.delete(
  '/:id',
  authenticateToken,
  authorizeRole([UserRole.FISIOTERAPEUTA]),
  eliminarRutina
);

router.get(
  '/activa/:paciente_id',
  authenticateToken,
  obtenerRutinaActiva
);

router.get(
  '/historial/:paciente_id',
  authenticateToken,
  obtenerHistorialRutinas
);

router.get(
  '/paciente/:paciente_id/ejercicios',
  authenticateToken,
  obtenerTodosLosEjerciciosPaciente
);

router.get(
  '/:id/ejercicios',
  authenticateToken,
  authorizeRole([UserRole.FISIOTERAPEUTA]),
  obtenerEjerciciosPorRutina
);

export default router;