import express from 'express';
const router = express.Router();
import { getSiteImages, updateSiteImage } from '../controllers/siteImageController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').get(getSiteImages).post(protect, admin, updateSiteImage);

export default router;
