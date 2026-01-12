import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config({ path: '../.env' });

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const createAdmin = async () => {
    await connectDB();

    const username = 'admin';
    const password = 'password123';

    try {
        const userExists = await User.findOne({ username });

        if (userExists) {
            console.log('User "admin" already exists. Updating password...');
            userExists.password = password;
            await userExists.save();
            console.log('Password successfully reset.');
        } else {
            console.log('Creating new "admin" user...');
            await User.create({
                username,
                password,
                isAdmin: true
            });
            console.log('User created successfully.');
        }

        console.log('\n✅ credentials Configured:');
        console.log('Username:', username);
        console.log('Password:', password);
        console.log('\nUse these to log in at /admin');
    } catch (error) {
        console.error('Error creating admin:', error);
    }

    process.exit();
};

createAdmin();
