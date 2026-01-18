import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const runTest = async () => {
    console.log("Testing Gemini API...");
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
        console.error("❌ GEMINI_API_KEY is missing");
        return;
    }

    const genAI = new GoogleGenerativeAI(key);

    // Test a basic model
    try {
        console.log("Attempting 'gemini-1.5-flash'...");
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Hello");
        console.log("✅ SUCCESS with gemini-1.5-flash:", result.response.text());
        return;
    } catch (e) {
        console.error("❌ Failed with gemini-1.5-flash:", e.message);
    }

    try {
        console.log("Attempting 'gemini-pro'...");
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent("Hello");
        console.log("✅ SUCCESS with gemini-pro:", result.response.text());
    } catch (e) {
        console.error("❌ Failed with gemini-pro:", e.message);
    }
};

runTest();
