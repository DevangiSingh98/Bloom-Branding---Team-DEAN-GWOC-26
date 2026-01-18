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
            // Gemini SDK errors can be complex, so we check multiple places
            const errorString = JSON.stringify(error, Object.getOwnPropertyNames(error)).toLowerCase();
            const messageString = error.message?.toLowerCase() || "";
            const isRateLimit =
                messageString.includes('429') ||
                messageString.includes('rate limit') ||
                error.status === 429 ||
                error.response?.status === 429 ||
                errorString.includes('429') ||
                errorString.includes('rate_limit');

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
