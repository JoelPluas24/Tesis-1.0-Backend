import { Router } from 'express';
import { asociarEjercicioPatologia, crearEjercicio, obtenerEjercicios, obtenerEjercicioPorId, actualizarEjercicio, eliminarEjercicio } from '../controllers/ejercicio.controller.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';
import { authorizeRole } from '../middlewares/authorizeRole.js';
import { UserRole } from '../types/roles.js';

const router = Router();

router.post(
  '/',
  authenticateToken,
  authorizeRole([UserRole.ADMIN]),
  crearEjercicio
);
router.post(
  '/asociar',
  authenticateToken,
  authorizeRole([UserRole.ADMIN]),
  asociarEjercicioPatologia
);

router.get(
  '/',
  authenticateToken,
  obtenerEjercicios
);

router.get(
  '/:id',
  authenticateToken,
  obtenerEjercicioPorId
);

router.put(
  '/:id',
  authenticateToken,
  authorizeRole([UserRole.ADMIN]),
  actualizarEjercicio
);

router.delete(
  '/:id',
  authenticateToken,
  authorizeRole([UserRole.ADMIN]),
  eliminarEjercicio
);

export default router;