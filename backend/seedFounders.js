import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Founder from './models/Founder.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const foundersData = [
    {
        key: 'left',
        name: "Meghna Kherajani",
        role: "Co-founder",
        bio1: "I’m drawn to the stories that live beneath the surface of a brand—the quiet intentions, the emotions, and the purpose that give it meaning. I love observing people, culture, and nuance, and translating those insights into brand narratives that feel honest, thoughtful, and deeply human. For me, branding is not just about how something looks, but how it feels and the connection it creates.",
        bio2: "At Bloom Branding, I blend strategy with creativity to shape cohesive brand identities, meaningful content, and marketing experiences that help businesses stand out with clarity and grow with confidence in the digital space.",
        image: "/images/founders.png"
    },
    {
        key: 'right',
        name: "Anushi Shah",
        role: "Co-founder",
        bio1: "I started my career as a Graphic Designer four years ago, driven by a deep passion for design and an eagerness to constantly learn. Over time, this passion helped me discover not just my creative direction, but also my ability to lead and build meaningful visual stories.The belief in myself and my vision led to the creation of my own Branding & Advertising firm.",
        bio2: "Today, I proudly co-found Bloom Branding, where I blend aesthetics, strategy, and creative leadership to help brands grow, evolve, and truly bloom 🌷",
        image: "/images/founders.png"
    },
    {
        key: 'main', // If this is separate
        image: "/images/founders.png"
    }
];

const seedFounders = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected for Seeding');

        for (const founder of foundersData) {
            // Upsert: Update if exists (by key), Insert if not
            const filter = { key: founder.key };
            // If key is undefined (old data might not have it), this might be tricky, but for new/fixed structure we rely on key.
            // However, the user wants strictly these values.

            // Check if exist
            await Founder.findOneAndUpdate(
                filter,
                founder,
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );
            console.log(`Synced founder: ${founder.key}`);
        }

        console.log('Founders data seeded successfully.');
        process.exit();
    } catch (error) {
        console.error('Error seeding founders:', error);
        process.exit(1);
    }
};

seedFounders();
