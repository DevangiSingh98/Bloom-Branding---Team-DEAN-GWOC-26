import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Made optional for Google Auth
    googleId: { type: String }, // Added for Google Auth
    avatar: { type: String },   // Added for Profile Picture
    isAdmin: { type: Boolean, default: false }, // Changed default to false for new signups
    role: {
        type: String,
        enum: ['admin', 'client'],
        default: 'client' // Changed default to client
    },
    companyName: {
        type: String,
        default: ''
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
}, {
    timestamps: true
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    if (!this.password) return false; // Handle users with no password
    return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password') || !this.password) { // Skip if no password
        next();
        return; // Ensure we return to stop execution
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

export default User;
