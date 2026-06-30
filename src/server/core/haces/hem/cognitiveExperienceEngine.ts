import { GoogleGenAI } from "@google/genai";
import { InstitutionalKnowledgeBase } from "./institutionalKnowledge.js";
import { MemoryEventBus, MemoryEvents } from "./memoryEvents.js";
import { generateWithRetry, cleanJSON } from "../../../engines.js";
import { v4 as uuidv4 } from "uuid";

export class CognitiveExperienceEngine {
    private eventBus = MemoryEventBus.getInstance();

    constructor(private ikb: InstitutionalKnowledgeBase) {}

    public async synthesizeExperience(ai: GoogleGenAI, historicalContext: any): Promise<any> {
        // Hierarchy: Memory -> Knowledge -> Experience -> Wisdom -> Strategy
        const prompt = `You are the Cognitive Experience Engine.
Analyze the following historical context (Memory & Knowledge) to synthesize a higher-order strategic principle (Experience -> Strategy).
Context: ${JSON.stringify(historicalContext)}

Return JSON:
{
  "cognitive_principle": "A general rule derived from experience",
  "engineering_guideline": "A specific guideline for implementation",
  "strategic_recommendation": "Recommendation for future evolution"
}`;
        
        let result = {
            cognitive_principle: "Default principle",
            engineering_guideline: "Default guideline",
            strategic_recommendation: "Default recommendation"
        };

        try {
            const res = await generateWithRetry(ai, {
                model: "gemini-2.5-flash",
                contents: prompt,
                config: { responseMimeType: "application/json" }
            });
            result = await cleanJSON(res?.text || "{}", ai);
        } catch (e) {
            console.error("CognitiveExperienceEngine failed:", e);
        }

        this.eventBus.publish(MemoryEvents.COGNITIVE_EXPERIENCE_SYNTHESIZED, result);
        return result;
    }
}
