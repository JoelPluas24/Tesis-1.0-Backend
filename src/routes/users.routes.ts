import { Router } from 'express';
import { authenticateToken } from '../middlewares/authenticateToken.js';
import { obtenerPerfil } from '../controllers/users.controller.js';

const router = Router();

router.get(
  '/perfil',
  authenticateToken,
  obtenerPerfil
);

export default router;