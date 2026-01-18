import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini inside request handler to ensure env vars are loaded

// @desc    Generate ideas based on enquiry
// @route   POST /api/ai/generate
// @access  Private (Admin only - verified by middleware in route)
// @desc    Generate ideas based on enquiry
// @route   POST /api/ai/generate
// @access  Private (Admin only - verified by middleware in route)
export const generateIdeas = async (req, res) => {
    try {
        const { service, vibe, message, company } = req.body;

        console.log("----- GEMINI AI REQUEST -----");
        console.log("Company:", company);

        if (!process.env.GEMINI_API_KEY) {
            console.error("GEMINI_API_KEY is missing");
            throw new Error("GEMINI_API_KEY is missing configuration.");
        }

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
            Return the response in strictly formatted Markdown.
            - Idea 1: [Title] - [Brief Description]
            - Idea 2: [Title] - [Brief Description]
            - Idea 3: [Title] - [Brief Description]
            
            Keep it professional, visionary, and concise (under 50 words per idea).
        `;

        // Initialize Gemini
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        let model;
        let text;

        try {
            // Try Flash first
            model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const result = await model.generateContent(prompt);
            text = result.response.text();
        } catch (flashError) {
            console.warn("Gemini 1.5 Flash failed, trying gemini-pro...", flashError.message);
            // Fallback
            model = genAI.getGenerativeModel({ model: "gemini-pro" });
            const result = await model.generateContent(prompt);
            text = result.response.text();
        }

        console.log("Gemini Response Success");
        res.json({ ideas: text });

    } catch (error) {
        console.error("AI Generation Error Details:", error);

        // Improve error message for frontend
        let userMessage = "Failed to generate ideas.";
        if (error.message.includes("API_KEY")) userMessage = "Server missing API Key.";
        if (error.message.includes("candidate")) userMessage = "AI Safety Filter blocked response. Try different wording.";

        res.status(500).json({
            message: userMessage,
            error: error.message
        });
    }
};
