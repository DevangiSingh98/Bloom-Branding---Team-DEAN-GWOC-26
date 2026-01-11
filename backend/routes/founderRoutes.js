import express from 'express';
const router = express.Router();
import { getFounders, createFounder, updateFounder, deleteFounder } from '../controllers/founderController.js';

router.route('/').get(getFounders).post(createFounder);
router.route('/:id').delete(deleteFounder).put(updateFounder);

export default router;
