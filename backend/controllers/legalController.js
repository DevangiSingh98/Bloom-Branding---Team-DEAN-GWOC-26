
import Legal from '../models/Legal.js';

// @desc    Fetch all legal documents
// @route   GET /api/legal
// @access  Public
const getLegal = async (req, res) => {
    try {
        const docs = await Legal.find({});
        const legalMap = {};
        docs.forEach(doc => {
            legalMap[doc.type] = doc.content;
        });
        res.json(legalMap);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update legal document
// @route   POST /api/legal
// @access  Private/Admin
const updateLegal = async (req, res) => {
    const { type, content } = req.body;

    try {
        const updated = await Legal.findOneAndUpdate(
            { type },
            { type, content },
            { new: true, upsert: true }
        );
        res.status(200).json(updated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export { getLegal, updateLegal };
