import express from 'express';
const router = express.Router();
import { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from '../controllers/testimonialController.js';

router.route('/').get(getTestimonials).post(createTestimonial);
router.route('/:id').delete(deleteTestimonial).put(updateTestimonial);

export default router;
