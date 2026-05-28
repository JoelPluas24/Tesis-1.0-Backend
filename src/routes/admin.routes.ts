import { Router } from 'express';
import { asignarPaciente } from '../controllers/admin.controller.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';
import { authorizeRole } from '../middlewares/authorizeRole.js';
import { UserRole } from '../types/roles.js';
import { listarFisioterapeutas, actualizarFisioterapeuta, eliminarFisioterapeuta } from '../controllers/admin.controller.js';
import { listarPacientes, actualizarPaciente, eliminarPaciente, listarPacientesInactivos, reactivarPaciente } from '../controllers/admin.controller.js';
import { reporteGeneral } from '../controllers/admin.controller.js';

const router = Router();


router.get(
  '/pacientes',
  authenticateToken,
  authorizeRole([UserRole.ADMIN]),
  listarPacientes
);

router.get(
  '/pacientes-inactivos',
  authenticateToken,
  authorizeRole([UserRole.ADMIN]),
  listarPacientesInactivos
);

router.put(
  '/pacientes/:id',
  authenticateToken,
  authorizeRole([UserRole.ADMIN]),
  actualizarPaciente
);

router.delete(
  '/pacientes/:id',
  authenticateToken,
  authorizeRole([UserRole.ADMIN]),
  eliminarPaciente
);

router.put(
  '/pacientes/:id/reactivar',
  authenticateToken,
  authorizeRole([UserRole.ADMIN]),
  reactivarPaciente
);

router.get(
  '/fisioterapeutas',
  authenticateToken,
  authorizeRole([UserRole.ADMIN]),
  listarFisioterapeutas
);

router.put(
  '/fisioterapeutas/:id',
  authenticateToken,
  authorizeRole([UserRole.ADMIN]),
  actualizarFisioterapeuta
);

router.delete(
  '/fisioterapeutas/:id',
  authenticateToken,
  authorizeRole([UserRole.ADMIN]),
  eliminarFisioterapeuta
);

router.put(
  '/asignar-paciente',
  authenticateToken,
  authorizeRole([UserRole.ADMIN]),
  asignarPaciente
);

router.get(
  '/reporte-general',
  authenticateToken,
  authorizeRole([UserRole.ADMIN]),
  reporteGeneral
);

export default router;