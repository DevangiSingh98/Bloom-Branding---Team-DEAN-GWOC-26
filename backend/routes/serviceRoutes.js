import express from 'express';
const router = express.Router();
import { getServices, createService, deleteService, replaceServices } from '../controllers/serviceController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').get(getServices).post(protect, admin, createService).put(protect, admin, replaceServices);
router.route('/:id').delete(protect, admin, deleteService);

export default router;
