import { GoogleGenAI } from "@google/genai";
import { RegressionAssessment } from "./verificationTypes.js";
import { VerificationEventBus, VerificationEvents } from "./verificationEvents.js";
import { generateWithRetry, cleanJSON } from "../../../engines.js";

export class RegressionVerifier {
    private eventBus = VerificationEventBus.getInstance();

    public async verifyRegression(ai: GoogleGenAI, currentVersion: any, previousVersion: any): Promise<RegressionAssessment> {
        const prompt = `Compare the current version of the module with its previous version to detect any regressions.
Previous Version Data: ${JSON.stringify(previousVersion)}
Current Version Data: ${JSON.stringify(currentVersion)}

Identify any lost functionality, decreased performance, or newly introduced security flaws compared to the baseline.

Return JSON:
{
  "functional_regressions": [],
  "performance_regressions": [],
  "security_regressions": [],
  "passed": true
}`;

        let result: any = {
            functional_regressions: [],
            performance_regressions: [],
            security_regressions: [],
            passed: true
        };

        try {
            const res = await generateWithRetry(ai, {
                model: "gemini-2.5-flash",
                contents: prompt,
                config: { responseMimeType: "application/json" }
            });
            result = await cleanJSON(res?.text || "{}", ai);
        } catch (e) {
            console.error("RegressionVerifier failed:", e);
        }

        const assessment: RegressionAssessment = {
            functional_regressions: result.functional_regressions || [],
            performance_regressions: result.performance_regressions || [],
            security_regressions: result.security_regressions || [],
            passed: result.passed ?? false
        };

        if (!assessment.passed) {
            this.eventBus.publish(VerificationEvents.REGRESSION_DETECTED, assessment);
        }

        return assessment;
    }
}
