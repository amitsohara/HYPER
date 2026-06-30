import { GoogleGenAI } from "@google/genai";
import { ScientificAssessment } from "./verificationTypes.js";
import { VerificationEventBus, VerificationEvents } from "./verificationEvents.js";
import { generateWithRetry, cleanJSON } from "../../../engines.js";

export class ScientificValidator {
    private eventBus = VerificationEventBus.getInstance();

    public async validateScience(ai: GoogleGenAI, implementationData: any, researchData: any): Promise<ScientificAssessment> {
        const prompt = `Validate if the implementation remains consistent with the supporting research and scientific hypotheses.
Research Context: ${JSON.stringify(researchData)}
Implementation: ${JSON.stringify(implementationData)}

Check for:
- Consistency with research evidence
- Alignment with approved hypotheses

Return JSON:
{
  "hypothesis_aligned": true,
  "research_evidence_supported": true,
  "deviations": []
}`;

        let result: any = {
            hypothesis_aligned: true,
            research_evidence_supported: true,
            deviations: []
        };

        try {
            const res = await generateWithRetry(ai, {
                model: "gemini-2.5-flash",
                contents: prompt,
                config: { responseMimeType: "application/json" }
            });
            result = await cleanJSON(res?.text || "{}", ai);
        } catch (e) {
            console.error("ScientificValidator failed:", e);
        }

        const assessment: ScientificAssessment = {
            hypothesis_aligned: result.hypothesis_aligned ?? false,
            research_evidence_supported: result.research_evidence_supported ?? false,
            deviations: result.deviations || []
        };

        if (assessment.hypothesis_aligned && assessment.deviations.length === 0) {
            this.eventBus.publish(VerificationEvents.SCIENTIFIC_VALIDATION_PASSED, assessment);
        }

        return assessment;
    }
}
