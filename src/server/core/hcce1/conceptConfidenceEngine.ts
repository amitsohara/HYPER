import { CanonicalConcept } from "./types.js";

export class ConceptConfidenceEngine {
    public updateConfidence(concept: CanonicalConcept, usageDelta: number = 0, observationDelta: number = 0): void {
        concept.metrics.usageFrequency += usageDelta;
        concept.metrics.observationCount += observationDelta;
        
        // Simple heuristic for confidence
        const base = (concept.metrics.evidenceCount * 0.2) + (concept.metrics.observationCount * 0.1);
        const newConfidence = Math.min(1.0, base + (concept.metrics.verificationScore * 0.5));
        
        concept.metrics.confidence = newConfidence;
    }
}
