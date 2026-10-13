import { Router } from 'express';
import { getUserProfile, updateUserProfile } from '../controllers/userController.ts';
import { authenticateToken } from '../middleware/auth.ts';

const router = Router();

router.get('/profile', authenticateToken, getUserProfile);
router.put('/profile', authenticateToken, updateUserProfile);

export default router;
