import { Router } from 'express';
import { register, login, googleAuth, logout, getMe } from '../controllers/authController.ts';
import { authenticateToken } from '../middleware/auth.ts';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleAuth);
router.post('/logout', logout);
router.get('/me', authenticateToken, getMe);

export default router;
