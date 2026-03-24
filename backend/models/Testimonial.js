import mongoose from 'mongoose';

const testimonialSchema = mongoose.Schema({
    text: { type: String, required: true },
    author: { type: String, required: true },
}, {
    timestamps: true
});

const Testimonial = mongoose.model('Testimonial', testimonialSchema);

export default Testimonial;
