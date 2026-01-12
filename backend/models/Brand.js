import mongoose from 'mongoose';

const brandSchema = mongoose.Schema({
    name: { type: String },
    logo: { type: String }, // Base64
}, {
    timestamps: true
});

const Brand = mongoose.model('Brand', brandSchema);
export default Brand;
