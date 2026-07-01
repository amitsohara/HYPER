import { CanonicalConcept, ConceptLifecycleState } from "./types.js";
import { ConceptMemory } from "./conceptMemory.js";
import { v4 as uuidv4 } from "uuid";

export class ConceptEvolutionEngine {
    constructor(private memory: ConceptMemory) {}

    public mergeConcepts(id1: string, id2: string, newName: string): CanonicalConcept | null {
        const c1 = this.memory.get(id1);
        const c2 = this.memory.get(id2);
        
        if (!c1 || !c2) return null;

        const merged: CanonicalConcept = {
            id: uuidv4(),
            name: newName,
            description: `Merged from ${c1.name} and ${c2.name}`,
            parentConcepts: [...new Set([...c1.parentConcepts, ...c2.parentConcepts])],
            childConcepts: [...new Set([...c1.childConcepts, ...c2.childConcepts])],
            relatedConcepts: [...c1.relatedConcepts, ...c2.relatedConcepts],
            origin: "Merge",
            evidence: [...new Set([...c1.evidence, ...c2.evidence])],
            metrics: {
                confidence: Math.max(c1.metrics.confidence, c2.metrics.confidence),
                evidenceCount: c1.metrics.evidenceCount + c2.metrics.evidenceCount,
                observationCount: c1.metrics.observationCount + c2.metrics.observationCount,
                usageFrequency: c1.metrics.usageFrequency + c2.metrics.usageFrequency,
                verificationScore: Math.max(c1.metrics.verificationScore, c2.metrics.verificationScore),
                historicalStability: 1.0
            },
            worldModelReferences: [...new Set([...c1.worldModelReferences, ...c2.worldModelReferences])],
            temporalHistory: [{ timestamp: Date.now(), event: "Merged" }],
            researchTraceability: c1.researchTraceability,
            version: 1,
            lifecycleState: ConceptLifecycleState.ACTIVE,
            metadata: {}
        };

        c1.lifecycleState = ConceptLifecycleState.MERGED;
        c2.lifecycleState = ConceptLifecycleState.MERGED;

        this.memory.save(merged);
        return merged;
    }

    public deprecateConcept(id: string): void {
        const c = this.memory.get(id);
        if (c) {
            c.lifecycleState = ConceptLifecycleState.DEPRECATED;
        }
    }
}
