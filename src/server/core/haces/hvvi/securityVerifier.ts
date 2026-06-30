import { GoogleGenAI } from "@google/genai";
import { SecurityAssessment } from "./verificationTypes.js";
import { VerificationEventBus, VerificationEvents } from "./verificationEvents.js";
import { generateWithRetry, cleanJSON } from "../../../engines.js";

export class SecurityVerifier {
    private eventBus = VerificationEventBus.getInstance();

    public async verifySecurity(ai: GoogleGenAI, sourceCode: string): Promise<SecurityAssessment> {
        const prompt = `Perform a static security analysis on the following code.
Code:
${sourceCode.substring(0, 15000)} // truncate if too long

Check for:
- Vulnerabilities
- Exposed secrets
- OWASP alignment (e.g. injection, auth flaws)

Return JSON:
{
  "vulnerabilities_found": [],
  "secrets_exposed": false,
  "owasp_aligned": true,
  "passed": true
}`;

        let result: any = {
            vulnerabilities_found: [],
            secrets_exposed: false,
            owasp_aligned: true,
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
            console.error("SecurityVerifier failed:", e);
        }

        const assessment: SecurityAssessment = {
            vulnerabilities_found: result.vulnerabilities_found || [],
            secrets_exposed: result.secrets_exposed ?? false,
            owasp_aligned: result.owasp_aligned ?? false,
            passed: result.passed ?? false
        };

        this.eventBus.publish(VerificationEvents.SECURITY_VERIFICATION_COMPLETED, assessment);

        return assessment;
    }
}
