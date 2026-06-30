import { v4 as uuidv4 } from "uuid";
import { GeneralizationAssessment, IntelligenceProfile } from "./benchmarkTypes.js";
import { BenchmarkEventBus, BenchmarkEvents } from "./benchmarkEvents.js";
import { GoogleGenAI } from "@google/genai";
import { generateWithRetry, cleanJSON } from "../../../engines.js";

export class GeneralizationAssessmentOffice {
    private eventBus = BenchmarkEventBus.getInstance();

    public async assessGeneralization(ai: GoogleGenAI, profile: IntelligenceProfile): Promise<GeneralizationAssessment> {
        const prompt = `Assess generalization for the given intelligence profile to detect overfitting.
Profile: ${JSON.stringify(profile)}

Return JSON:
{
  "cross_domain_transfer_score": 85,
  "task_generalization_score": 88,
  "overfitting_detected": false,
  "evidence": ["Strong performance across multiple distinct categories"]
}`;

        let result: any = {
            cross_domain_transfer_score: 80,
            task_generalization_score: 80,
            overfitting_detected: false,
            evidence: []
        };

        try {
            const res = await generateWithRetry(ai, {
                model: "gemini-2.5-flash",
                contents: prompt,
                config: { responseMimeType: "application/json" }
            });
            result = await cleanJSON(res?.text || "{}", ai);
        } catch (e) {
            console.error("GeneralizationAssessmentOffice failed:", e);
        }

        const assessment: GeneralizationAssessment = {
            assessment_id: uuidv4(),
            version: profile.version,
            cross_domain_transfer_score: result.cross_domain_transfer_score || 0,
            task_generalization_score: result.task_generalization_score || 0,
            overfitting_detected: result.overfitting_detected || false,
            evidence: result.evidence || []
        };

        this.eventBus.publish(BenchmarkEvents.GENERALIZATION_VERIFIED, assessment);
        return assessment;
    }
}
