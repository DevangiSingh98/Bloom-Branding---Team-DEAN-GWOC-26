import mongoose from 'mongoose';

const vibeSchema = mongoose.Schema({
    label: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    // Optional: Add category or color if needed later
}, {
    timestamps: true
});

const Vibe = mongoose.model('Vibe', vibeSchema);

export default Vibe;
