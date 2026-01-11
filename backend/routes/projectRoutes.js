import express from 'express';
const router = express.Router();
import { getProjects, createProject, deleteProject, updateProject } from '../controllers/projectController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').get(getProjects).post(createProject);
router.route('/:id').delete(deleteProject).put(updateProject);

export default router;
