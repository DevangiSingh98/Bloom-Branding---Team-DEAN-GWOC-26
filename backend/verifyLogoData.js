import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Brand from './models/Brand.js';
import connectDB from './config/db.js';

dotenv.config({ path: '../.env' });
if (!process.env.MONGODB_URI) dotenv.config();

const verifyLogos = async () => {
    try {
        await connectDB();
        const brands = await Brand.find({});
        console.log(`Found ${brands.length} brands.`);

        brands.forEach((b, i) => {
            const logoPreview = b.logo ? `${b.logo.substring(0, 30)}... [Length: ${b.logo.length}]` : 'NULL/UNDEFINED';
            console.log(`Brand ${i + 1} (_id: ${b._id}): Logo=${logoPreview}`);
        });

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

verifyLogos();
