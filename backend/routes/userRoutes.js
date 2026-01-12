import express from 'express';
const router = express.Router();
import { authUser, registerUser, forgotPassword, resetPassword } from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.post('/login', authUser);
router.post('/forgotpassword', forgotPassword);
router.post('/resetpassword', resetPassword);
router.post('/', protect, admin, registerUser);

export default router;
