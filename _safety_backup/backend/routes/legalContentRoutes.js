import express from 'express';
import LegalContent from '../models/legalContentModel.js';

// import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Get legal content by type
// @route   GET /api/legal-content/:type
// @access  Public
router.get('/:type', async (req, res) => {
    try {
        const { type } = req.params;
        let legalContent = await LegalContent.findOne({ type });

        if (!legalContent) {
            // Return default/empty content if not found, rather than 404, to avoid frontend errors on fresh install
            return res.json({ type, content: '<p>Content not yet populated.</p>' });
        }

        res.json(legalContent);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update legal content
// @route   PUT /api/legal-content/:type
// @access  Public (Temporary fix for debugging)
router.put('/:type', async (req, res) => {
    try {
        const { type } = req.params;
        const { content } = req.body;
        console.log(`[LegalContent] Update Request for ${type}:`, content?.substring(0, 50) + '...');


        let legalContent = await LegalContent.findOne({ type });

        if (legalContent) {
            legalContent.content = content;
            const updatedContent = await legalContent.save();
            res.json(updatedContent);
        } else {
            const newContent = await LegalContent.create({
                type,
                content
            });
            res.status(201).json(newContent);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
