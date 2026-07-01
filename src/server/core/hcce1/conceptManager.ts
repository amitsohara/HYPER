import { CanonicalConcept, ConceptLifecycleState } from "./types.js";
import { ConceptMemory } from "./conceptMemory.js";
import { ConceptValidationEngine } from "./conceptValidationEngine.js";
import { ConceptConfidenceEngine } from "./conceptConfidenceEngine.js";
import { v4 as uuidv4 } from "uuid";

export class ConceptManager {
    constructor(
        private memory: ConceptMemory,
        private validationEngine: ConceptValidationEngine,
        private confidenceEngine: ConceptConfidenceEngine
    ) {}

    public createConcept(name: string, description: string, evidence: string[]): CanonicalConcept {
        const concept: CanonicalConcept = {
            id: uuidv4(),
            name,
            description,
            parentConcepts: [],
            childConcepts: [],
            relatedConcepts: [],
            origin: "Discovery",
            evidence,
            metrics: {
                confidence: 0.1,
                evidenceCount: evidence.length,
                observationCount: 1,
                usageFrequency: 0,
                verificationScore: 0,
                historicalStability: 1.0
            },
            worldModelReferences: [],
            temporalHistory: [{ timestamp: Date.now(), event: "Created" }],
            researchTraceability: {
                hirqIds: [],
                wcpId: "WCP-001",
                cepId: "CEP-001",
                hctIds: []
            },
            version: 1,
            lifecycleState: ConceptLifecycleState.DISCOVERED,
            metadata: {}
        };

        this.validationEngine.validateConcept(concept);
        this.memory.save(concept);
        return concept;
    }

    public getConcept(id: string): CanonicalConcept | undefined {
        return this.memory.get(id);
    }
}
