import Client from '../models/Client.js';

const getClients = async (req, res) => {
    try {
        const items = await Client.find({});
        res.json(items);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

const createClient = async (req, res) => {
    try {
        const item = new Client(req.body);
        const created = await item.save();
        res.status(201).json(created);
    } catch (error) { res.status(400).json({ message: error.message }); }
};

const updateClient = async (req, res) => {
    try {
        const item = await Client.findById(req.params.id);
        if (item) {
            Object.assign(item, req.body);
            const updated = await item.save();
            res.json(updated);
        } else { res.status(404).json({ message: 'Not found' }); }
    } catch (error) { res.status(400).json({ message: error.message }); }
};

const deleteClient = async (req, res) => {
    try {
        const item = await Client.findById(req.params.id);
        if (item) {
            await item.deleteOne();
            res.json({ message: 'Removed' });
        } else { res.status(404).json({ message: 'Not found' }); }
    } catch (error) { res.status(500).json({ message: error.message }); }
};

export { getClients, createClient, updateClient, deleteClient };
