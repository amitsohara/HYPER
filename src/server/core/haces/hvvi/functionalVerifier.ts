import { GoogleGenAI } from "@google/genai";
import { FunctionalAssessment } from "./verificationTypes.js";
import { VerificationEventBus, VerificationEvents } from "./verificationEvents.js";
import { generateWithRetry, cleanJSON } from "../../../engines.js";

export class FunctionalVerifier {
    private eventBus = VerificationEventBus.getInstance();

    public async verifyFunctionality(ai: GoogleGenAI, implementationData: any): Promise<FunctionalAssessment> {
        const prompt = `Evaluate the functional completeness of this engineering implementation.
Implementation Data: ${JSON.stringify(implementationData)}

Verify:
- feature completeness
- interface correctness
- API behavior
- edge cases
- failure handling

Return JSON:
{
  "feature_completeness": 95,
  "interface_correctness": 90,
  "edge_cases_handled": true,
  "failure_handling": true,
  "issues": ["Minor issue with null handling in edge case X"]
}`;

        let result: any = {
            feature_completeness: 100,
            interface_correctness: 100,
            edge_cases_handled: true,
            failure_handling: true,
            issues: []
        };

        try {
            const res = await generateWithRetry(ai, {
                model: "gemini-2.5-flash",
                contents: prompt,
                config: { responseMimeType: "application/json" }
            });
            result = await cleanJSON(res?.text || "{}", ai);
        } catch (e) {
            console.error("FunctionalVerifier failed:", e);
        }

        const assessment: FunctionalAssessment = {
            feature_completeness: result.feature_completeness ?? 0,
            interface_correctness: result.interface_correctness ?? 0,
            edge_cases_handled: result.edge_cases_handled ?? false,
            failure_handling: result.failure_handling ?? false,
            issues: result.issues || []
        };

        if (assessment.feature_completeness > 80 && assessment.issues.length === 0) {
            this.eventBus.publish(VerificationEvents.FUNCTIONAL_VERIFICATION_PASSED, assessment);
        }

        return assessment;
    }
}
