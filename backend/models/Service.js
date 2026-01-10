import mongoose from 'mongoose';

const serviceSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String }, // URL or identifier for an icon
    details: { type: [String] } // List of bullet points
}, {
    timestamps: true
});

const Service = mongoose.model('Service', serviceSchema);

export default Service;
