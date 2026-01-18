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
            item.title = req.body.title !== undefined ? req.body.title : item.title;
            item.category = req.body.category !== undefined ? req.body.category : item.category;
            item.image = req.body.image !== undefined ? req.body.image : item.image;
            item.video = req.body.video !== undefined ? req.body.video : item.video;
            item.link = req.body.link !== undefined ? req.body.link : item.link;
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
