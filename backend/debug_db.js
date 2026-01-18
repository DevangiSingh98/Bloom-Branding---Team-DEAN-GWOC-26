import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Message from './models/Message.js';
import User from './models/User.js';

dotenv.config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);

        console.log('\n--- DATABASE DEBUG REPORT ---');

        // Count Documents
        const messageCount = await Message.countDocuments();
        const userCount = await User.countDocuments();

        console.log(`Collection 'messages' count: ${messageCount}`);
        console.log(`Collection 'users' count: ${userCount}`);

        // List Collections
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('\nExisting Collections:');
        collections.forEach(c => console.log(` - ${c.name}`));

        console.log('\n-----------------------------');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

connectDB();
