import Instagram from '../models/Instagram.js';

const getInstagramPosts = async (req, res) => {
    try {
        const posts = await Instagram.find({});
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createInstagramPost = async (req, res) => {
    const { image, link } = req.body;
    try {
        const post = new Instagram({ image, link });
        const created = await post.save();
        res.status(201).json(created);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateInstagramPost = async (req, res) => {
    try {
        const post = await Instagram.findById(req.params.id);
        if (post) {
            post.image = req.body.image || post.image;
            post.link = req.body.link || post.link;
            const updated = await post.save();
            res.json(updated);
        } else {
            res.status(404).json({ message: 'Not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteInstagramPost = async (req, res) => {
    try {
        const post = await Instagram.findById(req.params.id);
        if (post) {
            await post.deleteOne();
            res.json({ message: 'Removed' });
        } else {
            res.status(404).json({ message: 'Not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { getInstagramPosts, createInstagramPost, updateInstagramPost, deleteInstagramPost };
