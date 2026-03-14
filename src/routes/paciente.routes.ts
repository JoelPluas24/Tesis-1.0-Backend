import { Router } from 'express';
import { obtenerEjerciciosRecomendados } from '../controllers/paciente.controller.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';
import { authorizeRole } from '../middlewares/authorizeRole.js';
import { UserRole } from '../types/roles.js';

const router = Router();

router.get(
  '/:paciente_id/recomendaciones',
  authenticateToken,
  authorizeRole([UserRole.ADMIN, UserRole.FISIOTERAPEUTA]),
  obtenerEjerciciosRecomendados
);

export default router;