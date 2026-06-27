import { GoogleGenAI } from "@google/genai";
import { generateWithRetry, cleanJSON } from "../../engines.js";

export class PatternExtractor {
    static async extract(ai: GoogleGenAI, missionData: any, reflection: any, lessons: any, mistakes: any): Promise<any> {
        const prompt = `You are the HyperMind Pattern Extractor.
Extract reusable patterns from this mission execution.

Mission: ${missionData.mission}
Report/Outcome: ${JSON.stringify(missionData.report)}
Reflection: ${JSON.stringify(reflection)}
Lessons: ${JSON.stringify(lessons)}
Mistakes: ${JSON.stringify(mistakes)}

Return a valid JSON object matching this structure:
{
  "reusable_patterns": ["..."],
  "strategy_patterns": ["..."],
  "failure_patterns": ["..."],
  "success_patterns": ["..."],
  "transferable_patterns": ["..."]
}
`;
        try {
            const response = await generateWithRetry(ai, {
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: { responseMimeType: "application/json" }
            });
            let parsed = await cleanJSON(response?.text || "{}", ai);
            if (process.env.MODEL_MODE === 'dev_stub' && (!parsed.reusable_patterns || parsed.provider_used)) {
                 parsed = { reusable_patterns: ["Mock pattern 1"] };
            }
            return parsed;
        } catch (e) {
            console.error("[HECS] PatternExtractor failed", e);
            return {
                reusable_patterns: [],
                strategy_patterns: [],
                failure_patterns: [],
                success_patterns: [],
                transferable_patterns: []
            };
        }
    }
}
