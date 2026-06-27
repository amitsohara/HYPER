import { GoogleGenAI } from "@google/genai";
import { generateWithRetry, cleanJSON } from "../../engines.js";

export class AnalogyMapper {
    static async mapAnalogy(ai: GoogleGenAI, sourceDomain: string, targetDomain: string, sourcePatterns: string[], missionPrompt: string): Promise<{ analogy: string, reasoning: string }> {
        const prompt = `You are the HyperMind Analogy Mapper.
Map concepts from the source domain to the target domain based on the mission prompt.

Source Domain: ${sourceDomain}
Target Domain: ${targetDomain}
Target Mission: ${missionPrompt}
Source Patterns: ${JSON.stringify(sourcePatterns)}

Return a JSON object:
{
  "analogy": "Description of the analogy between the domains",
  "reasoning": "Why this analogy holds"
}
`;
        try {
            const response = await generateWithRetry(ai, {
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: { responseMimeType: "application/json" }
            });
            let parsed = await cleanJSON(response?.text || "{}", ai);
            
            if (process.env.MODEL_MODE === 'dev_stub' && (!parsed.analogy || parsed.provider_used)) {
                 parsed = { analogy: "Mock analogy", reasoning: "Mock reasoning" };
            }
            
            return {
                analogy: parsed.analogy || "No analogy found",
                reasoning: parsed.reasoning || ""
            };
        } catch (e) {
            console.error("[HECS] AnalogyMapper failed", e);
            return { analogy: "", reasoning: "" };
        }
    }
}
