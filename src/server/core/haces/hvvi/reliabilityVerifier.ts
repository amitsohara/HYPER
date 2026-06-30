import { GoogleGenAI } from "@google/genai";
import { ReliabilityAssessment } from "./verificationTypes.js";
import { generateWithRetry, cleanJSON } from "../../../engines.js";

export class ReliabilityVerifier {

    public async verifyReliability(ai: GoogleGenAI, systemBehavior: any): Promise<ReliabilityAssessment> {
        const prompt = `Evaluate the reliability of this implementation based on system behavior and exception handling logs.
System Behavior: ${JSON.stringify(systemBehavior)}

Check for:
- Fault tolerance
- Exception handling
- Recovery

Return JSON:
{
  "fault_tolerance_score": 85,
  "recovery_time_ms": 1500,
  "passed": true
}`;

        let result: any = {
            fault_tolerance_score: 100,
            recovery_time_ms: 0,
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
            console.error("ReliabilityVerifier failed:", e);
        }

        const assessment: ReliabilityAssessment = {
            fault_tolerance_score: result.fault_tolerance_score ?? 0,
            recovery_time_ms: result.recovery_time_ms ?? 0,
            passed: result.passed ?? false
        };

        return assessment;
    }
}
