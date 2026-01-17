import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Founder from './models/Founder.js';

dotenv.config({ path: '../.env' });

const checkFounders = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");

        const founders = await Founder.find({});
        console.log(`Found ${founders.length} founder documents:`);
        founders.forEach(f => { // Using simple for loop logic inside map or just logging
            console.log(`- ID: ${f._id} | Key: '${f.key}' | Name: '${f.name}'`);
        });

        if (founders.length === 0) {
            console.log("No founders found.");
        }

        mongoose.disconnect();
    } catch (err) {
        console.error("Error:", err);
        process.exit(1);
    }
};

checkFounders();
