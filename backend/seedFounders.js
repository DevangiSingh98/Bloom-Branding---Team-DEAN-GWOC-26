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
        bio1: "I’m drawn to the stories that live beneath a brand’s surface—the quiet intentions, emotions, and purpose that give it meaning. By observing people, culture, and nuance, I translate these insights into narratives that feel honest, thoughtful, and deeply human.",
        bio2: "At Bloom Branding, I blend strategy with creativity to craft cohesive brand identities, meaningful content, and immersive experiences. My goal is to help brands stand out with clarity and grow with confidence in the digital space.",
        image: "/images/founders.png"
    },
    {
        key: 'right',
        name: "Anushi Shah",
        role: "Co-founder",
        bio1: "I began my journey as a Graphic Designer four years ago, driven by a passion for design and learning. That journey shaped my creative voice and gave me the confidence to lead and build meaningful visual stories.",
        bio2: "Today, as the Co-founder of Bloom Branding, I blend aesthetics, strategy, and creativity to help brands grow, evolve, and truly bloom",
        image: "/images/founders.png"
    },
    {
        key: 'main', // If this is separate
        image: "/images/founders.png"
    },
    // Default Versions (Static Reference)
    {
        key: 'left_default',
        name: "Meghna Kherajani",
        role: "Co-founder",
        bio1: "I’m drawn to the stories that live beneath a brand’s surface—the quiet intentions, emotions, and purpose that give it meaning. By observing people, culture, and nuance, I translate these insights into narratives that feel honest, thoughtful, and deeply human.",
        bio2: "At Bloom Branding, I blend strategy with creativity to craft cohesive brand identities, meaningful content, and immersive experiences. My goal is to help brands stand out with clarity and grow with confidence in the digital space.",
        image: "/images/founders.png"
    },
    {
        key: 'right_default',
        name: "Anushi Shah",
        role: "Co-founder",
        bio1: "I began my journey as a Graphic Designer four years ago, driven by a passion for design and learning. That journey shaped my creative voice and gave me the confidence to lead and build meaningful visual stories.",
        bio2: "Today, as the Co-founder of Bloom Branding, I blend aesthetics, strategy, and creativity to help brands grow, evolve, and truly bloom",
        image: "/images/founders.png"
    },
    {
        key: 'main_default',
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
