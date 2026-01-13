import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Founder from './models/Founder.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const verifyFounders = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        const founders = await Founder.find({});
        console.log('Founders in DB:', JSON.stringify(founders, null, 2));

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

verifyFounders();
