import Asset from '../models/Asset.js';

// @desc    Get all assets for logged in user (Client) or specific user (Admin)
// @route   GET /api/assets
// @access  Private
const getAssets = async (req, res) => {
    try {
        if (req.user.role === 'admin' && req.query.userId) {
            // Admin viewing a specific client's assets
            const assets = await Asset.find({ user: req.query.userId }).sort({ createdAt: -1 });
            res.json(assets);
        } else if (req.user.role === 'admin') {
            // Admin viewing ALL assets
            const assets = await Asset.find({}).populate('user', 'name companyName');
            res.json(assets);
        } else {
            // Client viewing THEIR assets
            const assets = await Asset.find({ user: req.user._id }).sort({ createdAt: -1 });
            res.json(assets);
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching assets' });
    }
};

// @desc    Upload an asset (Admin only for now, assigning to a client)
// @route   POST /api/assets
// @access  Private/Admin
const uploadAsset = async (req, res) => {
    try {
        const { title, type, url, userId, format, size } = req.body;

        const asset = new Asset({
            user: userId, // ID of the client this asset belongs to
            title: title || 'Untitled',
            type,
            url,
            format,
            size
        });

        const createdAsset = await asset.save();
        res.status(201).json(createdAsset);
    } catch (error) {
        console.error("Upload Asset Error:", error);
        res.status(500).json({ message: 'Error creating asset' });
    }
};

// @desc    Delete asset
// @route   DELETE /api/assets/:id
// @access  Private (Admin or Owner)
const deleteAsset = async (req, res) => {
    try {
        const asset = await Asset.findById(req.params.id);

        if (!asset) {
            return res.status(404).json({ message: 'Asset not found' });
        }

        // Allow Admin OR Owner to delete
        if (req.user.role === 'admin' || asset.user.toString() === req.user._id.toString()) {
            await asset.deleteOne();
            res.json({ message: 'Asset removed' });
        } else {
            res.status(401).json({ message: 'Not authorized to delete this asset' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting asset' });
    }
};

export { getAssets, uploadAsset, deleteAsset };
