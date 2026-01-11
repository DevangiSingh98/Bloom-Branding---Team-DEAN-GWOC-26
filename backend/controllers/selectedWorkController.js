import SelectedWork from '../models/SelectedWork.js';

const getSelectedWorks = async (req, res) => {
    try {
        const items = await SelectedWork.find({});
        res.json(items);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

const createSelectedWork = async (req, res) => {
    try {
        const item = new SelectedWork(req.body);
        const created = await item.save();
        res.status(201).json(created);
    } catch (error) { res.status(400).json({ message: error.message }); }
};

const updateSelectedWork = async (req, res) => {
    try {
        const item = await SelectedWork.findById(req.params.id);
        if (item) {
            Object.assign(item, req.body);
            const updated = await item.save();
            res.json(updated);
        } else { res.status(404).json({ message: 'Not found' }); }
    } catch (error) { res.status(400).json({ message: error.message }); }
};

const deleteSelectedWork = async (req, res) => {
    try {
        const item = await SelectedWork.findById(req.params.id);
        if (item) {
            await item.deleteOne();
            res.json({ message: 'Removed' });
        } else { res.status(404).json({ message: 'Not found' }); }
    } catch (error) { res.status(500).json({ message: error.message }); }
};

export { getSelectedWorks, createSelectedWork, updateSelectedWork, deleteSelectedWork };
