import express from 'express';
const router = express.Router();
import { getInstagramPosts, createInstagramPost, updateInstagramPost, deleteInstagramPost } from '../controllers/instagramController.js';

import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').get(getInstagramPosts).post(protect, admin, createInstagramPost);
router.route('/:id').delete(protect, admin, deleteInstagramPost).put(protect, admin, updateInstagramPost);

export default router;
