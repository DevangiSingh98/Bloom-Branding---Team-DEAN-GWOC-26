import mongoose from 'mongoose';

const legalContentSchema = new mongoose.Schema({
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

const LegalContent = mongoose.model('LegalContent', legalContentSchema);

export default LegalContent;
