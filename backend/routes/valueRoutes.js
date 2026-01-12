import express from 'express';
const router = express.Router();
import { getValues, createValue, updateValue, deleteValue } from '../controllers/valueController.js';

import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').get(getValues).post(protect, admin, createValue);
router.route('/:id').delete(protect, admin, deleteValue).put(protect, admin, updateValue);

export default router;
