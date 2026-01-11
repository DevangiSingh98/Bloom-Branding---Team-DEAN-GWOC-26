import mongoose from 'mongoose';

const projectSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    category: { type: String, required: true }, // e.g., 'Branding', 'Web Design'
    link: { type: String }, // External link to project if applicable
    video: { type: String }, // Base64 or URL
}, {
    timestamps: true
});

const Project = mongoose.model('Project', projectSchema);

export default Project;
