import { DiagnosticConfidence } from "./diagnosticTypes.js";

export class DiagnosticPolicies {
    public static isHighConfidence(confidence: DiagnosticConfidence): boolean {
        return confidence.overall_confidence_score >= 80;
    }

    public static requiresAutopsy(missionData: any): boolean {
        // Require autopsy for failures, unexpected successes, or critical missions
        return !missionData.success || missionData.unexpected_outcome || missionData.criticality > 80;
    }

    public static shouldGenerateRecommendation(confidence: DiagnosticConfidence, severity: number): boolean {
        // Only recommend actions if we are confident and the issue is significant
        return this.isHighConfidence(confidence) && severity >= 50;
    }
}
