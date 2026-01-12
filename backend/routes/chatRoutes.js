import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();

router.post('/', async (req, res) => {
    const { message } = req.body;

    if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({
            error: 'API Key missing',
            details: 'GEMINI_API_KEY is not defined in backend environment variables.'
        });
    }

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        // Context for the bot to behave like Bloom Bot
        const context = `You are Bloom Bot, the helpful and creative AI assistant for Bloom Branding Studios. 
    Tone: Friendly, professional, artistic, and encouraging.
    Context: bloom branding is a creative agency specializing in Brand Strategy, Content Creation, Web Design, and Production. 
    Mission: To help brands bloom and command attention.
    Founder: Jane Doe.
    Services: Branding, Social Media, Production, Influencer Marketing, Creative Design.
    
    User Query: ${message}`;

        const result = await model.generateContent(context);
        const response = await result.response;
        const text = response.text();

        res.json({ reply: text });

    } catch (error) {
        console.error('Gemini API Error:', error);
        res.status(500).json({ error: 'Failed to generate response', details: error.message });
    }
});

export default router;
