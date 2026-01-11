import express from 'express';
const router = express.Router();
import { authUser, registerUser } from '../controllers/userController.js';

router.post('/login', authUser);
router.post('/', registerUser); // Public for now to create initial admin, block later

export default router;
