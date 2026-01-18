import express from 'express';
const router = express.Router();
import { createMessage, getMessages, deleteMessage, deleteMessages } from '../controllers/messageController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').post(createMessage).get(protect, admin, getMessages).delete(protect, admin, deleteMessages);
router.route('/:id').delete(protect, admin, deleteMessage);

export default router;
