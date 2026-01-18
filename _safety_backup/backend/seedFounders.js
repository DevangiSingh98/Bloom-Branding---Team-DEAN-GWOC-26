import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Founder from './models/Founder.js';

dotenv.config({ path: '../.env' });

const founders = [
    {
        key: 'main',
        image: '/images/founders.png',
        name: '',
        role: '',
        bio1: '',
        bio2: ''
    },
    {
        key: 'left',
        name: 'Meghna Kherajani',
        role: 'Co-founder',
        bio1: 'I’m drawn to the stories that live beneath a brand’s surface—the quiet intentions, emotions, and purpose that give it meaning. By observing people, culture, and nuance, I translate these insights into narratives that feel honest, thoughtful, and deeply human.',
        bio2: 'At Bloom Branding, I blend strategy with creativity to craft cohesive brand identities, meaningful content, and immersive experiences. My goal is to help brands stand out with clarity and grow with confidence in the digital space.',
        image: ''
    },
    {
        key: 'right',
        name: 'Anushi Shah',
        role: 'Co-founder',
        bio1: 'I began my journey as a Graphic Designer four years ago, driven by a passion for design and learning. That journey shaped my creative voice and gave me the confidence to lead and build meaningful visual stories.',
        bio2: 'Today, as the Co-founder of Bloom Branding, I blend aesthetics, strategy, and creativity to help brands grow, evolve, and truly bloom',
        image: ''
    }
];

const seedFounders = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");

        await Founder.deleteMany({});
        console.log("Cleared existing founders");

        await Founder.insertMany(founders);
        console.log("Seeded default founders");

        mongoose.disconnect();
    } catch (err) {
        console.error("Error:", err);
        process.exit(1);
    }
};

seedFounders();
