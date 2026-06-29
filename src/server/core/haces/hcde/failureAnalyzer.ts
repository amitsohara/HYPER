import { FailureRecord, DiagnosticConfidence, DiagnosticEvidence, RootCause } from "./diagnosticTypes.js";
import { DiagnosticEventBus, DiagnosticEvents } from "./diagnosticEvents.js";

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export class FailureAnalyzer {
    private eventBus = DiagnosticEventBus.getInstance();

    public analyze(
        missionData: any,
        evidence: DiagnosticEvidence[],
        rootCause: RootCause,
        contributingFactors: RootCause[],
        confidence: DiagnosticConfidence
    ): FailureRecord {
        const record: FailureRecord = {
            failure_id: uuidv4(),
            mission_id: missionData.mission_id || "unknown",
            symptoms: ["Timeout during execution", "Low simulation confidence"],
            observed_evidence: evidence,
            immediate_cause: contributingFactors.length > 0 ? contributingFactors[0] : rootCause,
            root_cause: rootCause,
            contributing_factors: contributingFactors,
            affected_modules: ["HWME", "HCW"],
            confidence,
            historical_similarity: 45,
            recommended_actions: ["Update world model schema"],
            resolution_status: "UNRESOLVED",
            timestamp: Date.now()
        };

        this.eventBus.publish(DiagnosticEvents.FAILURE_PATTERN_DETECTED, { record });
        return record;
    }
}
