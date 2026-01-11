import mongoose from 'mongoose';

const valueSchema = mongoose.Schema({
    title: { type: String, required: true },
    text: { type: String, required: true },
    icon: { type: String },
}, {
    timestamps: true
});

const Value = mongoose.model('Value', valueSchema);
export default Value;
