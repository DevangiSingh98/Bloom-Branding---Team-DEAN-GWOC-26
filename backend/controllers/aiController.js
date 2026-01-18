// @desc    Generate ideas based on enquiry
// @route   POST /api/ai/generate
// @access  Private (Admin only - verified by middleware in route)
export const generateIdeas = async (req, res) => {
    try {
        const { service, vibe, message, company, vibeDescription } = req.body;

        console.log("----- GEMINI AI REQUEST (Dynamic Import) -----");
        console.log("Company:", company);

        if (!process.env.GEMINI_API_KEY) {
            console.error("GEMINI_API_KEY is missing");
            throw new Error("GEMINI_API_KEY is missing configuration.");
        }

        // DYNAMIC IMPORT FOR SAFETY
        let GoogleGenerativeAI, HarmCategory, HarmBlockThreshold;
        try {
            const geminiModule = await import("@google/generative-ai");
            GoogleGenerativeAI = geminiModule.GoogleGenerativeAI;
            HarmCategory = geminiModule.HarmCategory;
            HarmBlockThreshold = geminiModule.HarmBlockThreshold;
        } catch (importError) {
            console.error("Failed to import @google/generative-ai:", importError);
            throw new Error(`AI Library Load Failed: ${importError.message}`);
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

        let model;
        let text;

        try {
            // Use Gemini 1.5 Flash (Most efficient and stable for tasks)
            model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", safetySettings });
            const result = await model.generateContent(prompt);
            text = result.response.text();
        } catch (flashError) {
            console.warn("Gemini 1.5 Flash failed, trying gemini-pro...", flashError.message);
            // Fallback
            model = genAI.getGenerativeModel({ model: "gemini-pro", safetySettings });
            const result = await model.generateContent(prompt);
            text = result.response.text();
        }

        console.log("Gemini Response Success");
        res.json({ ideas: text });

    } catch (error) {
        console.error("AI Generation Error Details (FULL):", JSON.stringify(error, Object.getOwnPropertyNames(error), 2));

        let userMessage = "Failed to generate ideas.";
        if (error.message.includes("API_KEY")) userMessage = "Server missing API Key.";
        if (error.message.includes("Library Load Failed")) userMessage = "Internal Server Error: AI Library Missing.";
        if (error.message.includes("candidate")) userMessage = "AI Safety Filter blocked response. Try different wording.";
        if (error.message.includes("429") || (error.status === 429)) {
            userMessage = "Rate limit exceeded. Please wait a minute.";
            return res.status(429).json({ message: userMessage, error: error.message });
        }

        // DEBUG: Expose full error
        userMessage = `${userMessage} Raw Error: ${error.message}`;

        res.status(500).json({
            message: userMessage,
            error: error.message
        });
    }
};
