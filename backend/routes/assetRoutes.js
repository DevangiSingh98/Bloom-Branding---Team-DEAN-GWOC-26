import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import { getAssets, uploadAsset, deleteAsset } from '../controllers/assetController.js';

const router = express.Router();

router.get('/', protect, getAssets);
router.post('/', protect, admin, uploadAsset);
router.delete('/:id', protect, deleteAsset);

export default router;
