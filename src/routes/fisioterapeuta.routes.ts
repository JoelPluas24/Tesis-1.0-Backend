import { Router } from 'express';
import { listarPacientesAsignados, verPatologiaPaciente, asignarPatologiaPaciente } from '../controllers/fisioterapeuta.controller.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';
import { authorizeRole } from '../middlewares/authorizeRole.js';
import { UserRole } from '../types/roles.js';

const router = Router();

router.get(
  '/mis-pacientes',
  authenticateToken,
  authorizeRole([UserRole.FISIOTERAPEUTA]),
  listarPacientesAsignados
);

router.get(
  '/pacientes/:paciente_id/patologias',
  authenticateToken,
  authorizeRole([UserRole.FISIOTERAPEUTA]),
  verPatologiaPaciente
);

router.post(
  '/pacientes/:paciente_id/patologias',
  authenticateToken,
  authorizeRole([UserRole.FISIOTERAPEUTA]),
  asignarPatologiaPaciente
);

export default router;