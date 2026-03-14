import { Router } from 'express';
import { loginUser, registerUser } from '../controllers/auth.controller.js';
import { authorizeRole } from '../middlewares/authorizeRole.js';
import { UserRole } from '../types/roles.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';
import { registerValidation } from '../validators/auth.validator.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { refreshAccessToken } from '../controllers/auth.controller.js';

const router = Router();

router.post('/register', authenticateToken, 
    authorizeRole([UserRole.ADMIN]),
    registerValidation,
    validateRequest, 
    registerUser,
);

router.post('/login', loginUser);

router.post('/refresh', refreshAccessToken);

export default router;