import { GoogleGenAI } from "@google/genai";
import { generateWithRetry, cleanJSON } from "../../engines.js";

export class ExperienceQualityScorer {
    static async score(ai: GoogleGenAI, missionData: any, reflection: any): Promise<{ quality_score: number; justification: string }> {
        const prompt = `You are the HyperMind Experience Quality Scorer.
Evaluate the overall quality of this mission experience for future learning.

Mission: ${missionData.mission}
Report/Outcome: ${JSON.stringify(missionData.report)}
Reflection: ${JSON.stringify(reflection)}
Evidence: ${JSON.stringify(missionData.evidence || [])}

Score the following aspects (0-10) internally:
- completeness
- usefulness
- novelty
- evidence_quality
- reasoning_quality
- planning_quality
- decision_quality
- domain_alignment
- transferability
- future_value

Then, provide an overall 'quality_score' (0-100) and a 'justification'.

Return a valid JSON object matching this structure:
{
  "quality_score": 85,
  "justification": "Detailed reasoning for the score"
}
`;
        try {
            const response = await generateWithRetry(ai, {
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: { responseMimeType: "application/json" }
            });
            let parsed = await cleanJSON(response?.text || "{}", ai);
            if (process.env.MODEL_MODE === 'dev_stub' && (parsed.quality_score === undefined || parsed.provider_used)) {
                 parsed = { quality_score: 95, justification: "Mocked quality" };
            }
            return {
                quality_score: parsed.quality_score || 0,
                justification: parsed.justification || "No justification provided."
            };
        } catch (e) {
            console.error("[HECS] ExperienceQualityScorer failed", e);
            return { quality_score: 0, justification: "Failed to score." };
        }
    }
}
