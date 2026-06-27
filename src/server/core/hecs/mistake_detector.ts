import { GoogleGenAI } from "@google/genai";
import { generateWithRetry, cleanJSON } from "../../engines.js";

export class MistakeDetector {
    static async detect(ai: GoogleGenAI, missionData: any, reflection: any): Promise<any> {
        const prompt = `You are the HyperMind Mistake Detector.
Analyze the mission execution for mistakes, hallucinations, and logic errors.
Every mistake must reference mission content.

Mission: ${missionData.mission}
Domain: ${missionData.mission_type}
Report/Outcome: ${JSON.stringify(missionData.report)}
Reflection: ${JSON.stringify(reflection)}
Evidence Length: ${missionData.evidence ? missionData.evidence.length : 0}

Check for:
- wrong-domain leakage (e.g., startup words in aerospace)
- missing evidence (if evidence is empty but claims are made)
- contradiction
- hallucinated confidence
- generic plan (lacking details)
- weak actionability
- failed module
- duplicate alternatives

Return a valid JSON object matching this structure:
{
  "wrong_domain_leakage": ["..."],
  "missing_evidence": ["..."],
  "contradictions": ["..."],
  "hallucinated_confidence": ["..."],
  "generic_plan_issues": ["..."],
  "weak_actionability": ["..."],
  "failed_modules": ["..."],
  "duplicate_alternatives": ["..."],
  "detected_mistakes": ["aggregated list of all critical mistakes"]
}
`;
        try {
            const response = await generateWithRetry(ai, {
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: { responseMimeType: "application/json" }
            });
            let parsed = await cleanJSON(response?.text || "{}", ai);
            if (process.env.MODEL_MODE === 'dev_stub' && (!parsed.detected_mistakes || parsed.provider_used)) {
                 parsed = { detected_mistakes: ["Mock mistake 1"] };
            }
            return parsed;
        } catch (e) {
            console.error("[HECS] MistakeDetector failed", e);
            return { detected_mistakes: [] };
        }
    }
}
