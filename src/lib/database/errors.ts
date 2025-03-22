export class TimeoutError extends Error {
    constructor(timeoutMs: number) {
        super(`Database timed out after ${timeoutMs}ms`);
        this.name = "TimeoutError";
    }
}
