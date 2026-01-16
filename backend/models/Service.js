import mongoose from 'mongoose';

const serviceSchema = mongoose.Schema({
    title: { type: String, required: true },
    subtitle: { type: String },
    description: { type: String, required: true }, // Simple tagline
    longText: { type: String }, // Detailed text
    image: { type: String }, // Image path/URL
    accent: { type: String }, // Color accent
    textColor: { type: String }, // Text color
    icon: { type: String }, // Keep for backward compat
    details: { type: [String] } // List of bullet points
}, {
    timestamps: true
});

const Service = mongoose.model('Service', serviceSchema);

export default Service;
