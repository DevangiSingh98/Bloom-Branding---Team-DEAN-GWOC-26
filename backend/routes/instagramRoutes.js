import express from 'express';
const router = express.Router();
import { getInstagramPosts, createInstagramPost, updateInstagramPost, deleteInstagramPost } from '../controllers/instagramController.js';

router.route('/').get(getInstagramPosts).post(createInstagramPost);
router.route('/:id').delete(deleteInstagramPost).put(updateInstagramPost);

export default router;
