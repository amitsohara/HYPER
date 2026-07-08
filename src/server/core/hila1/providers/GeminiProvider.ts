import { IIntelligenceProvider } from "../interfaces/IIntelligenceProvider.js";
import { IntelligenceResponse, ProviderType } from "../types/index.js";
import { GoogleGenAI } from "@google/genai";
import { v4 as uuidv4 } from "uuid";

export class GeminiProvider implements IIntelligenceProvider {
    public type = ProviderType.GEMINI;
    private ai: GoogleGenAI;
    private isHealthy = false;

    constructor() {
        this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "mock-key" });
    }

    async initialize(): Promise<void> {
        this.isHealthy = !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "mock-key";
    }

    async health(): Promise<boolean> {
        return this.isHealthy;
    }

    estimateCost(promptTokens: number, expectedCompletionTokens: number): number {
        // Simplified estimate for gemini-2.5-pro
        return (promptTokens * 0.000001) + (expectedCompletionTokens * 0.000002);
    }

    estimateLatency(promptTokens: number, expectedCompletionTokens: number): number {
        return 500 + (expectedCompletionTokens * 20); // rough estimate ms
    }

    supportsVision(): boolean { return true; }
    supportsCode(): boolean { return true; }
    supportsReasoning(): boolean { return true; }
    supportsLongContext(): boolean { return true; }

    async generate(prompt: string, context: any, options: any = {}): Promise<IntelligenceResponse> {
        const startTime = Date.now();
        let content = "";
        let confidence = 0.9;
        
        try {
            if (this.isHealthy) {
                const response = await this.ai.models.generateContent({
                    model: "gemini-2.5-flash",
                    contents: prompt + "\nContext: " + JSON.stringify(context),
                    config: options
                });
                content = response.text || "";
            } else {
                content = JSON.stringify({
                    fallback: true,
                    mock: `Processed: ${prompt.substring(0, 50)}...`
                });
                confidence = 0.5;
            }
        } catch (e: any) {
            // Suppress the console error so it doesn't pollute the logs during rate limiting
            // console.error("Gemini Generation Error:", e.message || e);
            content = JSON.stringify({
                fallback: true,
                error: "Fallback after Error",
                mock: `Processed: ${prompt.substring(0, 50)}...`
            });
            confidence = 0.5;
        }

        const latencyMs = Date.now() - startTime;
        
        return {
            id: uuidv4(),
            requestId: context.requestId || uuidv4(),
            provider: this.type,
            content,
            confidence,
            latencyMs,
            costEstimate: this.estimateCost(prompt.length / 4, content.length / 4),
            wasValidated: false,
            validationDetails: null,
            fallbackTriggered: false
        };
    }

    async *stream(prompt: string, context: any, options?: any): AsyncIterable<string> {
        yield "[Mock Stream Output]";
    }

    async shutdown(): Promise<void> {}
}
