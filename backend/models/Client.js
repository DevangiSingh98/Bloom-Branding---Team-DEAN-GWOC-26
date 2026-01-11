import mongoose from 'mongoose';

const clientSchema = mongoose.Schema({
    name: { type: String, required: true },
    logo: { type: String, required: true }, // Base64
}, {
    timestamps: true
});

const Client = mongoose.model('Client', clientSchema);
export default Client;
