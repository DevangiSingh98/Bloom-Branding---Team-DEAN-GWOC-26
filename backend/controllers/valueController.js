import Value from '../models/Value.js';

const getValues = async (req, res) => {
    try {
        const items = await Value.find({});
        res.json(items);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

const createValue = async (req, res) => {
    try {
        const item = new Value(req.body);
        const created = await item.save();
        res.status(201).json(created);
    } catch (error) { res.status(400).json({ message: error.message }); }
};

const updateValue = async (req, res) => {
    try {
        const item = await Value.findById(req.params.id);
        if (item) {
            Object.assign(item, req.body);
            const updated = await item.save();
            res.json(updated);
        } else { res.status(404).json({ message: 'Not found' }); }
    } catch (error) { res.status(400).json({ message: error.message }); }
};

const deleteValue = async (req, res) => {
    try {
        const item = await Value.findById(req.params.id);
        if (item) {
            await item.deleteOne();
            res.json({ message: 'Removed' });
        } else { res.status(404).json({ message: 'Not found' }); }
    } catch (error) { res.status(500).json({ message: error.message }); }
};

export { getValues, createValue, updateValue, deleteValue };
