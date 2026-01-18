import express from 'express';
import Vibe from '../models/Vibe.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Simple async handler to avoid dependency issues
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// @desc    Get all vibes
// @route   GET /api/vibes
// @access  Public
router.get('/', asyncHandler(async (req, res) => {
    const vibes = await Vibe.find({}).sort({ createdAt: 1 });
    res.json(vibes);
}));

// @desc    Add a vibe
// @route   POST /api/vibes
// @access  Private/Admin
router.post('/', protect, admin, asyncHandler(async (req, res) => {
    const { label } = req.body;

    if (!label) {
        res.status(400);
        throw new Error('Label is required');
    }

    const vibeExists = await Vibe.findOne({ label: { $regex: new RegExp(`^${label}$`, 'i') } });

    if (vibeExists) {
        res.status(400);
        throw new Error('Vibe already exists');
    }

    const vibe = await Vibe.create({ label });
    res.status(201).json(vibe);
}));

// @desc    Delete a vibe
// @route   DELETE /api/vibes/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, asyncHandler(async (req, res) => {
    const vibe = await Vibe.findById(req.params.id);

    if (vibe) {
        await vibe.deleteOne();
        res.json({ message: 'Vibe removed' });
    } else {
        res.status(404);
        throw new Error('Vibe not found');
    }
}));

// @desc    Initialize default vibes (if empty)
// @route   POST /api/vibes/init
// @access  Private/Admin
router.post('/init', protect, admin, asyncHandler(async (req, res) => {
    const count = await Vibe.countDocuments();
    if (count > 0) {
        return res.json({ message: 'Vibes already initialized' });
    }

    const defaultVibes = [
        'Minimalist', 'Bold & Loud', 'Luxury', 'Playful',
        'Geometric', 'Organic', 'Tech', 'Vintage',
        'Editorial', 'Abstract'
    ];

    await Vibe.insertMany(defaultVibes.map(v => ({ label: v })));
    res.json({ message: 'Default vibes initialized' });
}));

export default router;
