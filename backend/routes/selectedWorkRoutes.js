import express from 'express';
const router = express.Router();
import { getSelectedWorks, createSelectedWork, updateSelectedWork, deleteSelectedWork } from '../controllers/selectedWorkController.js';

import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').get(getSelectedWorks).post(protect, admin, createSelectedWork);
router.route('/:id').delete(protect, admin, deleteSelectedWork).put(protect, admin, updateSelectedWork);

export default router;
