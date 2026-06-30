import { GoogleGenAI } from "@google/genai";
import { TraceabilityRecord } from "./verificationTypes.js";
import { VerificationEventBus, VerificationEvents } from "./verificationEvents.js";
import { generateWithRetry, cleanJSON } from "../../../engines.js";

export class TraceabilityVerifier {
    private eventBus = VerificationEventBus.getInstance();

    public async verifyTraceability(ai: GoogleGenAI, engineeringData: any): Promise<TraceabilityRecord> {
        const prompt = `Analyze this engineering task and its context to verify full traceability back to the original mission.
Engineering Data: ${JSON.stringify(engineeringData)}

Does this implementation correctly link back to an architecture, research gap, diagnosis, observation, and mission?
Identify any missing links in the chain: Mission -> Observation -> Diagnosis -> Gap -> Research -> Architecture -> Engineering.

Return JSON:
{
  "is_traceable": true,
  "mission_id": "mission-123",
  "observation_id": "obs-123",
  "diagnosis_id": "diag-123",
  "gap_id": "gap-123",
  "research_id": "res-123",
  "architecture_id": "arch-123",
  "missing_links": []
}`;

        let result: any = { is_traceable: true, missing_links: [] };
        try {
            const res = await generateWithRetry(ai, {
                model: "gemini-2.5-flash",
                contents: prompt,
                config: { responseMimeType: "application/json" }
            });
            result = await cleanJSON(res?.text || "{}", ai);
        } catch (e) {
            console.error("TraceabilityVerifier failed:", e);
        }

        const record: TraceabilityRecord = {
            engineering_id: engineeringData.id || "unknown",
            mission_id: result.mission_id || engineeringData.mission_id || "unknown",
            observation_id: result.observation_id,
            diagnosis_id: result.diagnosis_id,
            gap_id: result.gap_id,
            research_id: result.research_id,
            architecture_id: result.architecture_id,
            is_traceable: result.is_traceable ?? false,
            missing_links: result.missing_links || []
        };

        if (record.is_traceable) {
            this.eventBus.publish(VerificationEvents.TRACEABILITY_VERIFIED, record);
        }

        return record;
    }
}
