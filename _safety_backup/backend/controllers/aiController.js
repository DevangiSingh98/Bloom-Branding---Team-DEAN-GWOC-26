import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini inside request handler to ensure env vars are loaded

// @desc    Generate ideas based on enquiry
// @route   POST /api/ai/generate
// @access  Private (Admin only - verified by middleware in route)
export const generateIdeas = async (req, res) => {
    try {
        const { service, vibe, message, company } = req.body;

        console.log("----- GEMINI AI REQUEST -----");
        console.log("Company:", company);
        console.log("API Key Status:", process.env.GEMINI_API_KEY ? "Loaded" : "MISSING");

        // Construct Prompt
        const prompt = `
            You are a creative director for a high-end branding agency called Bloom Branding.
            Generate 3 creative, actionable ideas for a new client enquiry.
            
            Client Details:
            - Company/Brand: ${company || 'Unknown Brand'}
            - Service Interested In: ${service || 'General Branding'}
            - Vibe/Aesthetic: ${vibe || 'Not specified'}
            - Client's Vision: "${message || 'No specific vision provided'}"

            Output Format:
            Provide exactly 3 distinct ideas (bullet points). 
            For each idea, provide a catchy title and a 1-sentence description.
            Keep the tone professional yet creative and visionary.
            Do not include any intro or outro text, just the 3 ideas.
        `;

        if (!process.env.GEMINI_API_KEY) {
            throw new Error("GEMINI_API_KEY is missing in backend environment variables.");
        }

        // Initialize Gemini
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // Use gemini-pro as standard fallback
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        console.log(`Sending request to Gemini (Model: gemini-pro)...`);
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log("Gemini Response Success");

        res.json({ ideas: text });

    } catch (error) {
        console.error("AI Generation Error Details:", error);
        res.status(500).json({
            message: "Failed to generate ideas.",
            error: error.message,
            stack: error.stack
        });
    }
};
