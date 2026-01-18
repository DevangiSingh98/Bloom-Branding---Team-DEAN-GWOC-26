import mongoose from 'mongoose';

const assetSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    title: { type: String, required: true },
    type: { type: String, enum: ['image', 'video', 'audio', 'document'], required: true },
    url: { type: String, required: true }, // Cloudinary URL
    format: { type: String }, // e.g., 'jpg', 'mp4'
    size: { type: Number }, // in bytes
}, {
    timestamps: true
});

const Asset = mongoose.model('Asset', assetSchema);

export default Asset;
