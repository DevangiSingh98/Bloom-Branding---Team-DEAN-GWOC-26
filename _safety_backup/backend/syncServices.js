
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Service from './models/Service.js';

dotenv.config({ path: '../.env' }); // Adjust if needed

const SERVICES_DATA = [
    {
        title: 'BRANDING',
        subtitle: 'IDENTITY & STRATEGY',
        description: 'Crafting identities that build dominance.',
        longText: 'Building a brand is about crafting a narrative that resonates deeply. We ensure your identity is not just seen but felt, creating a lasting dominance in your market. Our approach merges psychological depth with aesthetic precision.',
        image: '/images/dummypost4.png',
        accent: 'var(--color-electric-blue)',
        textColor: '#FFFFFF'
    },
    {
        title: 'SOCIAL MEDIA',
        subtitle: 'MEDIA & GROWTH',
        description: 'Quality strategies for your goals.',
        longText: 'In the digital age, attention is currency. We strategize to maximize engagement, ensuring your content reaches the right audience with precision and impact. From viral moments to sustained growth, we engineer interactions that convert.',
        image: '/images/s_social.jpg',
        accent: 'var(--color-butter-yellow)',
        textColor: 'var(--color-dark-choc)'
    },
    {
        title: 'PRODUCTION',
        subtitle: 'SHOOT & EDIT',
        description: 'Cinematic production aligned with your voice.',
        longText: 'Every frame matters. Our production team blends cinematic excellence with your brand voice to create visual stories that captivate. We handle everything from concept to final cut, delivering high-fidelity visuals that leave a lasting imprint.',
        image: '/images/s_production.jpg',
        accent: 'var(--color-electric-blue)',
        textColor: '#FFFFFF'
    },
    {
        title: 'INFLUENCER',
        subtitle: 'CONNECT & AMPLIFY',
        description: 'Authentic partnerships maximizing your value.',
        longText: 'True influence is built on authenticity. We connect you with voices that amplify your message, creating partnerships that drive real value. By leveraging data-driven matchmaking, we ensure your brand aligns with creators who embody your values.',
        image: '/images/s_influencer.jpg',
        accent: 'var(--color-butter-yellow)',
        textColor: 'var(--color-dark-choc)'
    },
    {
        title: 'CREATIVE',
        subtitle: 'DESIGN & DIRECTION',
        description: 'Designing experiences that captivate.',
        longText: 'Design is intelligence made visible. We push creative boundaries to deliver experiences that leave a mark, merging aesthetics with strategy. Our designs are crafted to not only look stunning but to function seamlessly across your brand ecosystem.',
        image: '/images/s_creative.jpg',
        accent: 'var(--color-electric-blue)',
        textColor: '#FFFFFF'
    }
];

const syncServices = async () => {
    try {
        await connectDB();
        console.log('MongoDB Connected via Mongoose');

        await Service.deleteMany({}); // Clear existing services (Optional: remove if you want to update instead)
        console.log('Existing services cleared.');

        await Service.insertMany(SERVICES_DATA);
        console.log('Services Synced Successfully!');

        process.exit();
    } catch (error) {
        console.error('Error syncing services:', error);
        process.exit(1);
    }
};

syncServices();
