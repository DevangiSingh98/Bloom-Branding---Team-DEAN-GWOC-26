
import express from 'express';
import { getLegal, updateLegal } from '../controllers/legalController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getLegal).post(protect, admin, updateLegal);

export default router;
