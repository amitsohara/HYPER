import crypto from "crypto";

interface CacheEntry {
  hash: string;
  response: any;
  timestamp: number;
  estimatedTokens: number;
}

export class PromptCache {
  private cache = new Map<string, CacheEntry>();

  private generateHash(prompt: string, context?: any): string {
    const data = prompt + (context ? JSON.stringify(context) : "");
    return crypto.createHash("sha256").update(data).digest("hex");
  }

  get(prompt: string, context?: any): CacheEntry | null {
    const hash = this.generateHash(prompt, context);
    const entry = this.cache.get(hash);
    if (entry) {
      // Optional: Add TTL check here if needed
      return entry;
    }
    return null;
  }

  set(prompt: string, response: any, estimatedTokens: number, context?: any) {
    const hash = this.generateHash(prompt, context);
    this.cache.set(hash, {
      hash,
      response,
      timestamp: Date.now(),
      estimatedTokens
    });
  }

  clear() {
    this.cache.clear();
  }
}

export const globalPromptCache = new PromptCache();
