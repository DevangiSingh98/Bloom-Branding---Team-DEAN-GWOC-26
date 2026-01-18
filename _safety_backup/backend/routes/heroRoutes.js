import express from 'express';
const router = express.Router();
import { getHero, updateHero } from '../controllers/heroController.js';

import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').get(getHero).post(protect, admin, updateHero).put(protect, admin, updateHero);

export default router;
