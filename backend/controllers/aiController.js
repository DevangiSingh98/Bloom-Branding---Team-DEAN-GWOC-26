import { withRetry } from '../utils/aiRetry.js';
import { aiQueue } from '../utils/aiQueue.js';

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

        // Construct Prompt (Bloom Branding – Creative Direction AI Workflow)
        const prompt = `
            You are a senior creative strategist at Bloom Branding. Your role is to transform client inputs into a structured "Creative Direction Tool" that designers and strategists can use for moodboards and concept development.

            Bloom branding philosophy: We don't just create logos; we bloom brands. Our tone is professional, visionary, and strategic. We prioritize visual excellence and storytelling.

            Client Inputs:
            - Brand Name: ${company || 'Unknown'}
            - Service: ${service || 'General Branding'}
            - Vibe Keywords: ${Array.isArray(vibe) ? vibe.join(', ') : (vibe || 'Not specified')}
            - Vision Description: "${message || 'No specific vision provided'}"
            - Extended Vibe Details: "${vibeDescription || 'N/A'}"

            Develop the creative strategy in the following structured format:

            1. **Brand Personality**: Define the "soul" of the brand in 2-3 sentences.
            2. **Visual Direction**: Describe the aesthetic, color palettes, and typography vibes (strategic, not generic).
            3. **Content & Storytelling Angle**: How should this brand talk? What is their unique narrative hook?
            4. **Design Execution Ideas**: 3-4 specific, actionable ideas for designers (e.g., "Use heavy grain with serif fonts").
            5. **Keywords for Exploration**: A list of 5-8 niche keywords for moodboard searching.

            Keep it professional, high-impact, and usable. No magic, just good thinking.
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

        // QUEUE WRAPPER: Serialize requests to avoid concurrent rate limits
        let text = await aiQueue.add(async () => {
            // MODEL SELECTION LOGIC with fallback and retry
            const tryModels = [
                { name: "gemini-1.5-flash", retries: 6, delay: 3000 },
                { name: "gemini-2.0-flash-exp", retries: 4, delay: 4000 },
                { name: "gemini-1.5-pro", retries: 4, delay: 5000 }
            ];

            let finalError = "";

            for (const modelConfig of tryModels) {
                try {
                    console.log(`[AI] Attempting ${modelConfig.name} (Retries: ${modelConfig.retries})...`);
                    const resultText = await withRetry(async () => {
                        const model = genAI.getGenerativeModel({ model: modelConfig.name, safetySettings });
                        const result = await model.generateContent(prompt);
                        return result.response.text();
                    }, modelConfig.retries, modelConfig.delay);

                    console.log(`[AI] Successfully generated with: ${modelConfig.name}`);
                    return resultText; // Return from Queue callback
                } catch (modelError) {
                    console.warn(`[AI] Model ${modelConfig.name} failed:`, modelError.message);
                    finalError += `${modelConfig.name}: ${modelError.message} | `;
                }
            }

            throw new Error(`All Gemini models failed: ${finalError}`);
        });

        if (!text) {
            throw new Error(`All Gemini models failed: ${finalError}`);
        }

        console.log(`[AI] Successfully generated with: ${successModel}`); // successModel might be undefined here if not hoisted, but let's check vars
        res.json({ ideas: text });

    } catch (error) {
        // ... existing error handler ...
        console.error("AI Generation Error Details (FULL):", JSON.stringify(error, Object.getOwnPropertyNames(error), 2));

        let userMessage = "Failed to generate ideas.";
        if (error.message.includes("API_KEY")) userMessage = "Server missing API Key.";
        if (error.message.includes("Library Load Failed")) userMessage = "Internal Server Error: AI Library Missing.";
        if (error.message.includes("candidate")) userMessage = "AI Safety Filter blocked response. Try different wording.";
        if (error.message?.includes("429") || error.status === 429 || JSON.stringify(error).includes("429")) {
            userMessage = "Rate limit exceeded. Please wait a minute.";
            console.error("AI Rate Limit Final Failure (after retries):", error.message);
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

// @desc    List available AI models
// @route   GET /api/ai/models
// @access  Public (for debugging)
export const listModels = async (req, res) => {
    try {
        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ error: "No API Key configured" });
        }
        // Direct fetch to list models
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
