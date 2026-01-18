import Hero from '../models/Hero.js';

const getHero = async (req, res) => {
    try {
        const item = await Hero.findOne({});
        res.json(item || {});
    } catch (error) { res.status(500).json({ message: error.message }); }
};

const updateHero = async (req, res) => {
    try {
        let item = await Hero.findOne({});
        if (item) {
            item.subtitle = req.body.subtitle || item.subtitle;
            const updated = await item.save();
            res.json(updated);
        } else {
            item = new Hero(req.body);
            const created = await item.save();
            res.status(201).json(created);
        }
    } catch (error) { res.status(400).json({ message: error.message }); }
};

export { getHero, updateHero };
