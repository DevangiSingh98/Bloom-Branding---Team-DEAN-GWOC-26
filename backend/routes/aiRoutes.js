import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import { generateIdeas, listModels } from '../controllers/aiController.js';

const router = express.Router();

// Protected route (Admin only)
router.post('/generate', protect, admin, generateIdeas);

// Debug route to see available models
router.get('/models', listModels);

export default router;
