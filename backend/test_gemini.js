import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

async function testConnection() {
    const key = process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(key);

    try {
        console.log('Attempting to generate with gemini-flash-latest...');
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
        const result = await model.generateContent("Hello?");
        const response = await result.response;
        console.log('Success! Response:', response.text());
    } catch (error) {
        console.error('Error with gemini-flash-latest:', error.message);
    }
}

testConnection();
