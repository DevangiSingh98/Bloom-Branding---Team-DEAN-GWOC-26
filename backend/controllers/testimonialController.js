import Testimonial from '../models/Testimonial.js';

// @desc    Fetch all testimonials
// @route   GET /api/testimonials
// @access  Public
const getTestimonials = async (req, res) => {
    try {
        const testimonials = await Testimonial.find({});
        res.json(testimonials);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create/Update a testimonial
// @route   POST /api/testimonials
// @access  Public (Testing)
const createTestimonial = async (req, res) => {
    const { text, author, rating, image, video } = req.body;
    try {
        const testimonial = new Testimonial({ text, author, rating, image, video });
        const created = await testimonial.save();
        res.status(201).json(created);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateTestimonial = async (req, res) => {
    try {
        const t = await Testimonial.findById(req.params.id);
        if (t) {
            t.text = req.body.text || t.text;
            t.author = req.body.author || t.author;
            t.rating = req.body.rating || t.rating;
            t.image = req.body.image || t.image;
            t.video = req.body.video || t.video;
            const updated = await t.save();
            res.json(updated);
        } else {
            res.status(404).json({ message: 'Not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteTestimonial = async (req, res) => {
    try {
        const t = await Testimonial.findById(req.params.id);
        if (t) {
            await t.deleteOne();
            res.json({ message: 'Removed' });
        } else {
            res.status(404).json({ message: 'Not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial };
