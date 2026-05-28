import { Router } from 'express';
import { authenticateToken } from '../middlewares/authenticateToken.js';
import { obtenerPerfil, cambiarPassword } from '../controllers/users.controller.js';

const router = Router();

router.get(
  '/perfil',
  authenticateToken,
  obtenerPerfil
);

router.put(
  '/cambiar-password',
  authenticateToken,
  cambiarPassword
);

export default router;