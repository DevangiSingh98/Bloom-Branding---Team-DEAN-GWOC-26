import mongoose from 'mongoose';

const legalSchema = new mongoose.Schema({
    type: {
        type: String, // 'privacy' or 'terms'
        required: true,
        unique: true,
        enum: ['privacy', 'terms']
    },
    content: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const Legal = mongoose.model('Legal', legalSchema);

export default Legal;
