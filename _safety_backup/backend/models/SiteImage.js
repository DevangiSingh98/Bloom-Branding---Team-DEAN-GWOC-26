import mongoose from 'mongoose';

const siteImageSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true
    },
    section: {
        type: String,
        required: true
    },
    label: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const SiteImage = mongoose.model('SiteImage', siteImageSchema);

export default SiteImage;
