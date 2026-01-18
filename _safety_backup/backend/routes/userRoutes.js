import express from 'express';
const router = express.Router();
import { authUser, registerUser, registerClient, forgotPassword, resetPassword, getUsers, deleteUser } from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.post('/register', registerClient); // Public Registration
router.post('/login', authUser);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);
router.route('/').post(protect, admin, registerUser).get(protect, admin, getUsers);
router.route('/:id').delete(protect, admin, deleteUser);

export default router;
