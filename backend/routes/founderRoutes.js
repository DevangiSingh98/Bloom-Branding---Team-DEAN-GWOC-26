import express from 'express';
const router = express.Router();
import { getFounders, createFounder, updateFounder, deleteFounder } from '../controllers/founderController.js';

import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').get(getFounders).post(protect, admin, createFounder);
router.route('/:id').delete(protect, admin, deleteFounder).put(protect, admin, updateFounder);

export default router;
