import { GoogleGenAI } from "@google/genai";
import { generateWithRetry, cleanJSON } from "../../engines.js";

export class LessonExtractor {
    static async extract(ai: GoogleGenAI, missionData: any, reflection: any): Promise<any> {
        const prompt = `You are the HyperMind Lesson Extractor.
Extract useful lessons from this mission execution. Every lesson must reference mission content. No fake learning.

Mission: ${missionData.mission}
Report/Outcome: ${JSON.stringify(missionData.report)}
Reflection: ${JSON.stringify(reflection)}

Return a valid JSON object matching this structure:
{
  "lessons_learned": ["specific lesson 1", ...],
  "reusable_lessons": ["reusable lesson 1", ...],
  "domain_specific_lessons": ["domain lesson 1", ...],
  "cross_domain_lessons": ["cross domain lesson 1", ...]
}
`;
        try {
            const response = await generateWithRetry(ai, {
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: { responseMimeType: "application/json" }
            });
            let parsed = await cleanJSON(response?.text || "{}", ai);
            if (process.env.MODEL_MODE === 'dev_stub' && (!parsed.lessons_learned || parsed.provider_used)) {
                 parsed = { lessons_learned: ["Mock lesson 1", "Mock lesson 2"] };
            }
            return parsed;
        } catch (e) {
            console.error("[HECS] LessonExtractor failed", e);
            return {
                lessons_learned: [],
                reusable_lessons: [],
                domain_specific_lessons: [],
                cross_domain_lessons: []
            };
        }
    }
}
