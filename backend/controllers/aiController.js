import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

// Initialize Gemini inside request handler to ensure env vars are loaded

// @desc    Generate ideas based on enquiry
// @route   POST /api/ai/generate
// @access  Private (Admin only - verified by middleware in route)
export const generateIdeas = async (req, res) => {
    try {
        const { service, vibe, message, company, vibeDescription } = req.body;

        console.log("----- GEMINI AI REQUEST -----");
        console.log("Company:", company);

        if (!process.env.GEMINI_API_KEY) {
            console.error("GEMINI_API_KEY is missing");
            throw new Error("GEMINI_API_KEY is missing configuration.");
        }

        // Construct Prompt
        const prompt = `
            You are a senior marketing strategist for a high-end branding agency called Bloom Branding.
            Develop a concise, high-impact marketing strategy for a new client enquiry.
            
            Client Details:
            - Company/Brand: ${company || 'Unknown Brand'}
            - Service Interested In: ${service || 'General Branding'}
            - Vibe/Aesthetic: ${vibe || 'Not specified'}
            - Additional Vibe Details: "${vibeDescription || 'N/A'}"
            - Client's Vision: "${message || 'No specific vision provided'}"

            Output Format:
            Output Format:
            Provide a mini-strategy with exactly 3 sections (headings):
            1. **Brand Positioning**: One sentence defining their potential market position.
            2. **Target Audience**: A brief profile of who they should target.
            3. **Key Marketing Angles**: 3 bullet points of actionable marketing hooks.

            Keep the tone professional, strategic, and concise. Do not use markdown bolding in the output if possible, or keep it minimal.
        `;

        // Initialize Gemini
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        // Relaxed Safety Settings
        const safetySettings = [
            {
                category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                threshold: HarmBlockThreshold.BLOCK_NONE,
            },
            {
                category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                threshold: HarmBlockThreshold.BLOCK_NONE,
            },
            {
                category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                threshold: HarmBlockThreshold.BLOCK_NONE,
            },
            {
                category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                threshold: HarmBlockThreshold.BLOCK_NONE,
            },
        ];

        // Debug
        // console.log("Safety Settings:", JSON.stringify(safetySettings));

        let model;
        let text;

        try {
            // Use gemini-pro as primary for stability
            console.log("Using model: gemini-pro");
            model = genAI.getGenerativeModel({ model: "gemini-pro", safetySettings });
            const result = await model.generateContent(prompt);
            text = result.response.text();
        } catch (error) {
            console.warn("Primary model failed, trying fallback...", error.message);
            // Fallback (try same or varied)
            try {
                model = genAI.getGenerativeModel({ model: "gemini-1.0-pro", safetySettings });
                const result = await model.generateContent(prompt);
                text = result.response.text();
            } catch (fallbackError) {
                throw new Error(`All AI models failed. Main: ${error.message}`);
            }
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
