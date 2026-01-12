import mongoose from 'mongoose';

const brandSchema = mongoose.Schema({
    name: { type: String, required: true },
    logo: { type: String, required: true }, // Base64
}, {
    timestamps: true
});

const Brand = mongoose.model('Brand', brandSchema);
export default Brand;
