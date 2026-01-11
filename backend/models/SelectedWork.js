import mongoose from 'mongoose';

const selectedWorkSchema = mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String },
    image: { type: String }, // Base64
    link: { type: String },
}, {
    timestamps: true
});

const SelectedWork = mongoose.model('SelectedWork', selectedWorkSchema);
export default SelectedWork;
