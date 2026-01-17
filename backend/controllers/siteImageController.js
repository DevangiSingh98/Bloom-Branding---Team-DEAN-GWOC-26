import SiteImage from '../models/SiteImage.js';

// @desc    Fetch all site images
// @route   GET /api/site-images
// @access  Public
const getSiteImages = async (req, res) => {
    try {
        const images = await SiteImage.find({});
        // Convert array to object for easier frontend lookup: { 'home_hero_bg': 'url', ... }
        const imageMap = {};
        images.forEach(img => {
            imageMap[img.key] = img.image;
        });
        res.json(imageMap);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update or Create a site image
// @route   POST /api/site-images
// @access  Private/Admin
const updateSiteImage = async (req, res) => {
    const { section, label, key, image } = req.body;

    try {
        // Find by key and update, or create if not exists
        const updatedImage = await SiteImage.findOneAndUpdate(
            { key }, // Filter
            { section, label, key, image }, // Update
            { new: true, upsert: true } // Options: Return new doc, Create if missing
        );
        res.status(200).json(updatedImage);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export { getSiteImages, updateSiteImage };
