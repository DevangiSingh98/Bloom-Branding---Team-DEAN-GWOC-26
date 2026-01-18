import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

// @desc    Generate ideas based on enquiry
// @route   POST /api/ai/generate
// @access  Private (Admin only)
export const generateIdeas = async (req, res) => {
    try {
        console.log("TEST MODE: Skipping AI generation");
        // Temporary Stub to verify Server/Auth is working
        return res.json({ ideas: "TEST SUCCESS: The backend is reachable and Auth is working. The issue WAS the AI library/Key configuration." });

    } catch (error) {
        console.error("Critical Server Error:", error);
        res.status(500).json({ message: "Server Crash in Controller", error: error.message });
    }
};
