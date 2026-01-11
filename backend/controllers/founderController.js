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
            Object.assign(item, req.body);
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
