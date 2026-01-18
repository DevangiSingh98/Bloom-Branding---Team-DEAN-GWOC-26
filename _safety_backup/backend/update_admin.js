import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const updateAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        const user = await User.findOne({ username: 'admin' });

        if (user) {
            user.email = 'nandanajus3006@gmail.com';
            user.password = '321'; // Mongoose middleware will hash this
            await user.save();
            console.log('Admin user updated.');
            console.log('Email: nandanajus3006@gmail.com');
            console.log('Password: 321');
        } else {
            console.log('Admin user not found');
        }

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

updateAdmin();
