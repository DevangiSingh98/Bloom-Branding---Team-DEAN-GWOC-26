import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const runTest = async () => {
    console.log("Testing Gemini API...");
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
        console.error("❌ GEMINI_API_KEY is missing from .env");
        return;
    }
    console.log("Key found:", key.substring(0, 10) + "...");

    const genAI = new GoogleGenerativeAI(key);
    try {
        console.log("Attempting to connect to 'gemini-1.5-flash'...");
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Say hello!");
        console.log("✅ Main Model Success:", result.response.text());
    } catch (e) {
        console.error("❌ Main Model Failed:", e.message);

        try {
            console.log("Attempting fallback to 'gemini-pro'...");
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            const result = await model.generateContent("Say hello!");
            console.log("✅ Fallback Model Success:", result.response.text());
        } catch (e2) {
            console.error("❌ Fallback Model Failed:", e2.message);
        }
    }
};

runTest();
