import { GoogleGenAI } from "@google/genai";
import { CapabilityCategory, CapabilityScore, IntelligenceProfile } from "./benchmarkTypes.js";
import { generateWithRetry, cleanJSON } from "../../../engines.js";

export class IntelligenceEvaluationEngine {
    
    public async evaluateCapabilities(ai: GoogleGenAI, benchmarkResults: any[], version: string): Promise<IntelligenceProfile> {
        const prompt = `Evaluate the following benchmark results to produce capability scores.
Results: ${JSON.stringify(benchmarkResults)}

Return JSON:
{
  "capabilities": {
    "REASONING": { "score": 90, "confidence": 95, "trend": "UP", "contributing_benchmarks": ["b-1"] }
  },
  "continuous_intelligence_index": 88
}`;
        let result: any = {
            capabilities: {},
            continuous_intelligence_index: 80
        };

        try {
            const res = await generateWithRetry(ai, {
                model: "gemini-2.5-flash",
                contents: prompt,
                config: { responseMimeType: "application/json" }
            });
            result = await cleanJSON(res?.text || "{}", ai);
        } catch (e) {
            console.error("IntelligenceEvaluationEngine failed:", e);
        }

        const profile: IntelligenceProfile = {
            version,
            timestamp: Date.now(),
            capabilities: result.capabilities || {},
            continuous_intelligence_index: result.continuous_intelligence_index || 0
        };

        return profile;
    }
}
