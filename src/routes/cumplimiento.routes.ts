import { Router } from 'express';
import { registrarCumplimiento, verProgresoPaciente, verHistorialPaciente } from '../controllers/cumplimiento.controller.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';
import { authorizeRole } from '../middlewares/authorizeRole.js';
import { UserRole } from '../types/roles.js';

const router = Router();

router.post(
  '/',
  authenticateToken,
  authorizeRole([UserRole.PACIENTE]),
  registrarCumplimiento
);

router.get(
  '/progreso/:paciente_id',
  authenticateToken,
  verProgresoPaciente
);

router.get(
  '/historial/:paciente_id',
  authenticateToken,
  verHistorialPaciente
);

export default router;