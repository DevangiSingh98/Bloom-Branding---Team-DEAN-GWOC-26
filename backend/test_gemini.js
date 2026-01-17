import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

const testGemini = async () => {
    console.log("Testing Gemini API Connection...");
    console.log("API Key present:", !!process.env.GEMINI_API_KEY);

    if (!process.env.GEMINI_API_KEY) {
        console.error("ERROR: GEMINI_API_KEY is missing.");
        return;
    }

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // Test with gemini-1.5-flash first
        const modelName = "gemini-pro";
        console.log(`Using model: ${modelName}`);

        const model = genAI.getGenerativeModel({ model: modelName });
        const prompt = "Say 'Hello, I am working!' if you can hear me.";

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log("SUCCESS! Response:", text);
    } catch (error) {
        console.error("FAILURE:");
        console.error(error.message);
        if (error.message.includes("404")) {
            console.log("Tip: Model name might be wrong or not available in this region.");
        }
        if (error.message.includes("400") || error.message.includes("API key")) {
            console.log("Tip: Check API Key validity.");
        }
    }
};

testGemini();
