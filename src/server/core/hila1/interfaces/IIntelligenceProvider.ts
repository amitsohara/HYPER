import { IntelligenceRequest, IntelligenceResponse, ProviderType } from "../types/index.js";

export interface IIntelligenceProvider {
    type: ProviderType;
    
    initialize(): Promise<void>;
    health(): Promise<boolean>;
    
    estimateCost(promptTokens: number, expectedCompletionTokens: number): number;
    estimateLatency(promptTokens: number, expectedCompletionTokens: number): number;
    
    supportsVision(): boolean;
    supportsCode(): boolean;
    supportsReasoning(): boolean;
    supportsLongContext(): boolean;
    
    generate(prompt: string, context: any, options?: any): Promise<IntelligenceResponse>;
    stream(prompt: string, context: any, options?: any): AsyncIterable<string>;
    
    shutdown(): Promise<void>;
}
