
/**
 * Simple in-memory queue to serialize AI requests and enforce global rate limits.
 * This ensures we don't bombard the API with concurrent requests.
 */

class AIQueue {
    constructor() {
        this.queue = [];
        this.processing = false;
        // Minimum delay between processing requests (to respect RPM)
        this.minDelay = 5000;
        this.lastProcessTime = 0;
    }

    /**
     * Add a task to the queue.
     * @param {Function} taskFn - Async function to execute
     * @returns {Promise<any>} - Resolves with task result
     */
    add(taskFn) {
        return new Promise((resolve, reject) => {
            this.queue.push({ taskFn, resolve, reject });
            this.processNext();
        });
    }

    async processNext() {
        if (this.processing || this.queue.length === 0) return;

        this.processing = true;
        const { taskFn, resolve, reject } = this.queue.shift();

        try {
            // Enforce minimum delay since last request
            const now = Date.now();
            const timeSinceLast = now - this.lastProcessTime;
            if (timeSinceLast < this.minDelay) {
                const waitTime = this.minDelay - timeSinceLast;
                console.log(`Queue: Waiting ${waitTime}ms to respect rate limit...`);
                await new Promise(r => setTimeout(r, waitTime));
            }

            console.log("Queue: Processing request...");
            const result = await taskFn();
            this.lastProcessTime = Date.now();
            resolve(result);

        } catch (error) {
            reject(error);
        } finally {
            this.processing = false;
            // Trigger next item
            this.processNext();
        }
    }
}

// Export a singleton instance
export const aiQueue = new AIQueue();
