import express from 'express';
const router = express.Router();
import { getProjects, createProject, deleteProject } from '../controllers/projectController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').get(getProjects).post(protect, admin, createProject);
router.route('/:id').delete(protect, admin, deleteProject);

export default router;
