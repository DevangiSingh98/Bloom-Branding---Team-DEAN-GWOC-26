import mongoose from 'mongoose';

const heroSchema = mongoose.Schema({
    subtitle: { type: String, required: true },
}, {
    timestamps: true
});

const Hero = mongoose.model('Hero', heroSchema);
export default Hero;
