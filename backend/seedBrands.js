import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Brand from './models/Brand.js';
import connectDB from './config/db.js';

// Load env vars
dotenv.config({ path: '../.env' });

// Check for URI in current dir if not found in parent
if (!process.env.MONGODB_URI) {
    console.log('MONGODB_URI not found in parent .env, trying current directory...');
    dotenv.config();
}

const seedBrands = async () => {
    try {
        await connectDB();

        console.log('Clearing existing brands...');
        await Brand.deleteMany({});

        const brands = [
            {
                logo: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==' // Red pixel placeholder
            },
            {
                logo: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==' // Green pixel placeholder
            }
        ];

        console.log('Inserting new brands...');
        await Brand.insertMany(brands);

        console.log('Brands seeded successfully!');
        process.exit();
    } catch (error) {
        console.error('Error seeding brands:', error);
        process.exit(1);
    }
};

seedBrands();
