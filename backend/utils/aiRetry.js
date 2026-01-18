/**
 * Utility to retry an async function with exponential backoff.
 * Especially useful for handling 429 (Rate Limit) errors from Gemini API.
 */
export const withRetry = async (fn, maxRetries = 3, initialDelay = 1000) => {
    let lastError;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;

            // Check if it's a rate limit error (429)
            const isRateLimit = error.message?.includes('429') || error.status === 429;

            if (isRateLimit && attempt < maxRetries) {
                const delay = initialDelay * Math.pow(2, attempt);
                console.warn(`AI Rate Limit hit. Retrying in ${delay}ms... (Attempt ${attempt + 1}/${maxRetries})`);
                await new Promise(resolve => setTimeout(resolve, delay));
                continue;
            }

            // If not a rate limit error or we've exhausted retries, throw it
            throw error;
        }
    }

    throw lastError;
};
