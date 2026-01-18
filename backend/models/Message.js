import mongoose from 'mongoose';

const messageSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    company: { type: String },
    service: { type: String },
    budget: { type: String },
    timeline: { type: String },
    subject: { type: String },
    message: { type: String },
    vibes: { type: [String], default: [] }, // Added vibes array
    vibeDescription: { type: String }, // Added vibe description
    read: { type: Boolean, default: false }
}, {
    timestamps: true
});

const Message = mongoose.model('Message', messageSchema);

export default Message;
