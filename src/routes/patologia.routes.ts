import { Router } from 'express';
import { 
  crearPatologia, 
  obtenerPatologias, 
  obtenerEjerciciosPorPatologia,
  obtenerPatologiaPorId,
  actualizarPatologia,
  eliminarPatologia
} from '../controllers/patologia.controller.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';
import { authorizeRole } from '../middlewares/authorizeRole.js';
import { UserRole } from '../types/roles.js';

const router = Router();

router.post(
  '/',
  authenticateToken,
  authorizeRole([UserRole.ADMIN]),
  crearPatologia
);

router.get(
  '/',
  authenticateToken,
  obtenerPatologias
);

router.get(
  '/:id',
  authenticateToken,
  obtenerPatologiaPorId
);

router.get(
  '/:id/ejercicios',
  authenticateToken,
  obtenerEjerciciosPorPatologia
);

router.put(
  '/:id',
  authenticateToken,
  authorizeRole([UserRole.ADMIN]),
  actualizarPatologia
);

router.delete(
  '/:id',
  authenticateToken,
  authorizeRole([UserRole.ADMIN]),
  eliminarPatologia
);

export default router;