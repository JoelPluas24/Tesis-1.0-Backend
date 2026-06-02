import { Router } from 'express';
import { obtenerEjerciciosRecomendados } from '../controllers/paciente.controller.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';
import { authorizeRole } from '../middlewares/authorizeRole.js';
import { authorizePatientAccess } from '../middlewares/authorizePatientAccess.js';
import { UserRole } from '../types/roles.js';

const router = Router();

router.get(
  '/:paciente_id/recomendaciones',
  authenticateToken,
  authorizeRole([UserRole.ADMIN, UserRole.FISIOTERAPEUTA]),
  authorizePatientAccess,
  obtenerEjerciciosRecomendados
);

export default router;