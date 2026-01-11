import express from 'express';
const router = express.Router();
import { createMessage, getMessages } from '../controllers/messageController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').post(createMessage).get(protect, admin, getMessages);

export default router;
