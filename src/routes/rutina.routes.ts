import { Router } from 'express';
import { crearRutina, obtenerRutinaActiva, obtenerHistorialRutinas, obtenerTodosLosEjerciciosPaciente, obtenerEjerciciosPorRutina, editarRutina, eliminarRutina } from '../controllers/rutina.controller.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';
import { authorizeRole } from '../middlewares/authorizeRole.js';
import { authorizePatientAccess } from '../middlewares/authorizePatientAccess.js';
import { UserRole } from '../types/roles.js';

const router = Router();

router.post(
  '/',
  authenticateToken,
  authorizeRole([UserRole.FISIOTERAPEUTA]),
  authorizePatientAccess,
  crearRutina
);

router.put(
  '/:id',
  authenticateToken,
  authorizeRole([UserRole.FISIOTERAPEUTA]),
  authorizePatientAccess,
  editarRutina
);

router.delete(
  '/:id',
  authenticateToken,
  authorizeRole([UserRole.FISIOTERAPEUTA]),
  authorizePatientAccess,
  eliminarRutina
);

router.get(
  '/activa/:paciente_id',
  authenticateToken,
  authorizePatientAccess,
  obtenerRutinaActiva
);

router.get(
  '/historial/:paciente_id',
  authenticateToken,
  authorizePatientAccess,
  obtenerHistorialRutinas
);

router.get(
  '/paciente/:paciente_id/ejercicios',
  authenticateToken,
  authorizePatientAccess,
  obtenerTodosLosEjerciciosPaciente
);

router.get(
  '/:id/ejercicios',
  authenticateToken,
  authorizeRole([UserRole.FISIOTERAPEUTA]),
  authorizePatientAccess,
  obtenerEjerciciosPorRutina
);

export default router;