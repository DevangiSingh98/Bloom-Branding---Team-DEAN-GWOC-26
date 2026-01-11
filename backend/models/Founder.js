import mongoose from 'mongoose';

const founderSchema = mongoose.Schema({
    name: { type: String },
    role: { type: String },
    key: { type: String }, // e.g., 'main', 'first', 'second'
    image: { type: String }, // Base64
    quote: { type: String },
}, {
    timestamps: true
});

const Founder = mongoose.model('Founder', founderSchema);
export default Founder;
