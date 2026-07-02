import { IntelligenceResponse } from "../types/index.js";

export class ResultCache {
    private cache = new Map<string, { response: IntelligenceResponse, timestamp: number }>();
    private TTL_MS = 60 * 60 * 1000; // 1 hour

    private generateKey(prompt: string, contextHash: string): string {
        return `${prompt}-${contextHash}`;
    }

    get(prompt: string, context: any): IntelligenceResponse | null {
        const key = this.generateKey(prompt, JSON.stringify(context));
        const entry = this.cache.get(key);
        
        if (entry) {
            if (Date.now() - entry.timestamp > this.TTL_MS) {
                this.cache.delete(key);
                return null;
            }
            return entry.response;
        }
        
        return null;
    }

    set(prompt: string, context: any, response: IntelligenceResponse): void {
        const key = this.generateKey(prompt, JSON.stringify(context));
        this.cache.set(key, { response, timestamp: Date.now() });
    }

    clear(): void {
        this.cache.clear();
    }
}
