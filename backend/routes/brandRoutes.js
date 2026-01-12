import express from 'express';
const router = express.Router();
import { getBrands, createBrand, updateBrand, deleteBrand } from '../controllers/brandController.js';

router.route('/').get(getBrands).post(createBrand);
router.route('/:id').delete(deleteBrand).put(updateBrand);

export default router;
