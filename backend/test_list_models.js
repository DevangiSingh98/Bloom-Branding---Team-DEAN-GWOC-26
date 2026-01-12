import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

async function listModels() {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
        console.error('No API Key');
        return;
    }

    // Custom fetch to list models since the helper might abstract it
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            console.error('API Error:', data.error);
        } else {
            console.log('Available Models:');
            if (data.models) {
                data.models.forEach(m => {
                    if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes('generateContent')) {
                        console.log(`- ${m.name}`);
                    }
                });
            } else {
                console.log('No models found (or unexpected format)', data);
            }
        }
    } catch (e) {
        console.error('Fetch error:', e);
    }
}

listModels();
