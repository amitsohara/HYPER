import { DiagnosticConfidence } from "./diagnosticTypes.js";

export class DiagnosticConfidenceEngine {
    public computeConfidence(evidence: any[], rootCause: any): DiagnosticConfidence {
        const evidence_quality = evidence.length > 0 ? 80 : 40;
        const data_completeness = 75;
        const historical_support = 60;
        const consistency = 90;
        const alternative_explanations = 20; // Lower is better for confidence

        const overall_confidence_score = (
            evidence_quality * 0.3 +
            data_completeness * 0.2 +
            historical_support * 0.2 +
            consistency * 0.2 +
            (100 - alternative_explanations) * 0.1
        );

        return {
            evidence_quality,
            data_completeness,
            historical_support,
            consistency,
            alternative_explanations,
            overall_confidence_score
        };
    }
}
