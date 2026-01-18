import mongoose from 'mongoose';

const instagramSchema = mongoose.Schema({
    image: { type: String, required: true }, // Base64 or URL
    video: { type: String }, // URL from Cloud Storage
    link: { type: String, default: '#' },
}, {
    timestamps: true
});

const Instagram = mongoose.model('Instagram', instagramSchema);

export default Instagram;
