import express from 'express';
const router = express.Router();
import { getValues, createValue, updateValue, deleteValue } from '../controllers/valueController.js';

router.route('/').get(getValues).post(createValue);
router.route('/:id').delete(deleteValue).put(updateValue);

export default router;
