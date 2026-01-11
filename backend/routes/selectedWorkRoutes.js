import express from 'express';
const router = express.Router();
import { getSelectedWorks, createSelectedWork, updateSelectedWork, deleteSelectedWork } from '../controllers/selectedWorkController.js';

router.route('/').get(getSelectedWorks).post(createSelectedWork);
router.route('/:id').delete(deleteSelectedWork).put(updateSelectedWork);

export default router;
