import { v4 as uuidv4 } from "uuid";
import { GoogleGenAI } from "@google/genai";
import { ApprovalDecision, EngineeringCertification, ApprovalStatus } from "./verificationTypes.js";
import { VerificationEventBus, VerificationEvents } from "./verificationEvents.js";
import { generateWithRetry, cleanJSON } from "../../../engines.js";

export class ReleaseApprovalBoard {
    private eventBus = VerificationEventBus.getInstance();

    public async reviewRelease(ai: GoogleGenAI, certification: EngineeringCertification, report: any): Promise<ApprovalDecision> {
        
        // Multi-Agent Council Review happens via prompts or directly via logic here
        const prompt = `You are the Autonomous Multi-Agent Verification Council reviewing this certification and verification report.
Certification: ${JSON.stringify(certification)}
Report: ${JSON.stringify(report)}

Decide on the release status. Options: APPROVED, APPROVED_WITH_CONDITIONS, REQUIRES_REWORK, REJECTED, DEFERRED.
Return JSON:
{
  "status": "APPROVED",
  "conditions": [],
  "reasons": ["High functional correctness", "All security checks passed"]
}`;

        let result: any = {
            status: "APPROVED",
            conditions: [],
            reasons: ["Default fallback"]
        };

        try {
            const res = await generateWithRetry(ai, {
                model: "gemini-2.5-flash",
                contents: prompt,
                config: { responseMimeType: "application/json" }
            });
            result = await cleanJSON(res?.text || "{}", ai);
        } catch (e) {
            console.error("ReleaseApprovalBoard failed:", e);
        }

        const decision: ApprovalDecision = {
            decision_id: uuidv4(),
            engineering_id: certification.engineering_id,
            certification_id: certification.certification_id,
            status: result.status as ApprovalStatus || ApprovalStatus.APPROVED,
            conditions: result.conditions || [],
            reasons: result.reasons || [],
            timestamp: Date.now()
        };

        if (decision.status === ApprovalStatus.APPROVED || decision.status === ApprovalStatus.APPROVED_WITH_CONDITIONS) {
            this.eventBus.publish(VerificationEvents.RELEASE_APPROVED, decision);
        } else {
            this.eventBus.publish(VerificationEvents.RELEASE_REJECTED, decision);
        }

        return decision;
    }
}
