import { CanonicalConcept, ConceptLifecycleState } from "./types.js";

export class ConceptValidationEngine {
    public validateConcept(concept: CanonicalConcept): boolean {
        if (concept.metrics.evidenceCount < 1) {
            return false;
        }
        if (concept.metrics.confidence < 0.1) {
            return false;
        }
        concept.lifecycleState = ConceptLifecycleState.ACTIVE;
        return true;
    }
}
