import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import { generateIdeas } from '../controllers/aiController.js';

const router = express.Router();

// Protected route (Admin only)
router.post('/generate', protect, admin, generateIdeas);

export default router;
