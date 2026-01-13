import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Brand from './models/Brand.js';
import connectDB from './config/db.js';

dotenv.config({ path: '../.env' });
if (!process.env.MONGODB_URI) dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seedBrandsFromFiles = async () => {
    try {
        await connectDB();
        console.log("Connected to MongoDB...");

        // Clear existing brands
        await Brand.deleteMany({});
        console.log("Cleared existing brands.");

        const imagesDir = path.join(__dirname, '../frontend/public/images');

        // List of specific files requested by user
        // amar ambc bafna binal patel bthere dhruv gems fine decor kaffyn lifes a beach mansi nagdev moire subhrekha the right cut thyme & whisk vardhaman
        const filesToSeed = [
            'amar.png',
            'ambc.png',
            'bafna.png',
            'binal patel.png',
            'bthere.png',
            'dhruv gems.png',
            'fine decor.png',
            'kaffyn.png',
            'lifes a beach.png',
            'mansi nagdev.png',
            'moire.png',
            'subhrekha.png',
            'the right cut.png',
            'thyme & whisk.png',
            'vardhaman.png',
            'bloomingthebrand.png' // Assuming this is 'bloomes'
        ];

        const brands = [];

        for (const file of filesToSeed) {
            const filePath = path.join(imagesDir, file);
            if (fs.existsSync(filePath)) {
                // Instead of Base64, we store the path relative to the public folder
                // valid for <img src="/images/filename.png" />
                brands.push({
                    logo: `/images/${file}`
                });
            } else {
                console.warn(`File not found: ${file}`);
            }
        }

        if (brands.length > 0) {
            await Brand.insertMany(brands);
            console.log(`Successfully seeded ${brands.length} brands from files!`);
        } else {
            console.log("No brands to seed. Check file paths.");
        }

        process.exit();
    } catch (error) {
        console.error("Error seeding brands:", error);
        process.exit(1);
    }
};

seedBrandsFromFiles();
