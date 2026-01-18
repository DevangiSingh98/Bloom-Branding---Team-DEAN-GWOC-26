import Brand from '../models/Brand.js';

const getBrands = async (req, res) => {
    try {
        const items = await Brand.find({});
        res.json(items);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

const createBrand = async (req, res) => {
    try {
        const item = new Brand(req.body);
        const created = await item.save();
        res.status(201).json(created);
    } catch (error) { res.status(400).json({ message: error.message }); }
};

const updateBrand = async (req, res) => {
    try {
        const item = await Brand.findById(req.params.id);
        if (item) {
            Object.assign(item, req.body);
            const updated = await item.save();
            res.json(updated);
        } else { res.status(404).json({ message: 'Not found' }); }
    } catch (error) { res.status(400).json({ message: error.message }); }
};

const deleteBrand = async (req, res) => {
    try {
        const item = await Brand.findById(req.params.id);
        if (item) {
            await item.deleteOne();
            res.json({ message: 'Removed' });
        } else { res.status(404).json({ message: 'Not found' }); }
    } catch (error) { res.status(500).json({ message: error.message }); }
};

export { getBrands, createBrand, updateBrand, deleteBrand };
