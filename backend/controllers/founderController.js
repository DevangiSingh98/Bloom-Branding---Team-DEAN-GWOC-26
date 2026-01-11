import Founder from '../models/Founder.js';

const getFounders = async (req, res) => {
    try {
        const items = await Founder.find({});
        res.json(items);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

const createFounder = async (req, res) => {
    try {
        const item = new Founder(req.body);
        const created = await item.save();
        res.status(201).json(created);
    } catch (error) { res.status(400).json({ message: error.message }); }
};

const updateFounder = async (req, res) => {
    try {
        const item = await Founder.findById(req.params.id);
        if (item) {
            item.name = req.body.name !== undefined ? req.body.name : item.name;
            item.role = req.body.role !== undefined ? req.body.role : item.role;
            item.image = req.body.image !== undefined ? req.body.image : item.image;
            item.bio1 = req.body.bio1 !== undefined ? req.body.bio1 : item.bio1;
            item.bio2 = req.body.bio2 !== undefined ? req.body.bio2 : item.bio2;
            item.key = req.body.key !== undefined ? req.body.key : item.key;
            item.quote = req.body.quote !== undefined ? req.body.quote : item.quote;
            const updated = await item.save();
            res.json(updated);
        } else { res.status(404).json({ message: 'Not found' }); }
    } catch (error) { res.status(400).json({ message: error.message }); }
};

const deleteFounder = async (req, res) => {
    try {
        const item = await Founder.findById(req.params.id);
        if (item) {
            await item.deleteOne();
            res.json({ message: 'Removed' });
        } else { res.status(404).json({ message: 'Not found' }); }
    } catch (error) { res.status(500).json({ message: error.message }); }
};

export { getFounders, createFounder, updateFounder, deleteFounder };
