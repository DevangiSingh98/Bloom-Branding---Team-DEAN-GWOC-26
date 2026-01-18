/**
 * Utility to retry an async function with exponential backoff.
 * Especially useful for handling 429 (Rate Limit) errors from Gemini API.
 */
export const withRetry = async (fn, maxRetries = 6, initialDelay = 3000) => {
    let lastError;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;

            // Check if it's a rate limit error (429)
            const errorString = JSON.stringify(error, Object.getOwnPropertyNames(error)).toLowerCase();
            const messageString = error.message?.toLowerCase() || "";
            const isRateLimit =
                messageString.includes('429') ||
                messageString.includes('rate limit') ||
                messageString.includes('exhausted') ||
                messageString.includes('quota') ||
                error.status === 429 ||
                error.response?.status === 429 ||
                errorString.includes('429') ||
                errorString.includes('rate_limit');

            if (isRateLimit && attempt < maxRetries) {
                // Exponential backoff with jitter: (2^attempt * initialDelay) + random
                const baseDelay = initialDelay * Math.pow(2, attempt);
                const jitter = Math.random() * 1000;
                const delay = baseDelay + jitter;

                console.warn(`[AI RETRY] Rate Limit (429) hit. Attempt ${attempt + 1}/${maxRetries}. Retrying in ${Math.round(delay)}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                continue;
            }

            // If not a rate limit error or we've exhausted retries, throw it
            throw error;
        }
    }

    throw lastError;
};
