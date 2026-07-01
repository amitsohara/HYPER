import { ThoughtObject, ThoughtLifecycleState } from "./types.js";
import { ThoughtPersistence } from "./thoughtPersistence.js";
import { v4 as uuidv4 } from "uuid";

export class ThoughtEvolutionEngine {
    constructor(private persistence: ThoughtPersistence) {}

    public refineThought(id: string, newDetailedRepresentation: string, additionalEvidence: string[]): void {
        const thought = this.persistence.get(id);
        if (thought) {
            thought.detailedRepresentation = newDetailedRepresentation;
            thought.evidence.push(...additionalEvidence);
            thought.version++;
            thought.lifecycleState = ThoughtLifecycleState.REFINED;
            thought.updatedAt = Date.now();
        }
    }

    public mergeThoughts(id1: string, id2: string, summary: string, detailedRepresentation: string): ThoughtObject | null {
        const t1 = this.persistence.get(id1);
        const t2 = this.persistence.get(id2);
        
        if (!t1 || !t2) return null;

        const merged: ThoughtObject = {
            id: uuidv4(),
            sessionId: t1.sessionId,
            origin: "Merge",
            currentStatus: "Merged from multiple thoughts",
            summary,
            detailedRepresentation,
            associatedWorldObjects: [...new Set([...t1.associatedWorldObjects, ...t2.associatedWorldObjects])],
            associatedConcepts: [...new Set([...t1.associatedConcepts, ...t2.associatedConcepts])],
            associatedGoals: [...new Set([...t1.associatedGoals, ...t2.associatedGoals])],
            associatedSpecialists: [...new Set([...t1.associatedSpecialists, ...t2.associatedSpecialists])],
            attentionScore: Math.max(t1.attentionScore, t2.attentionScore),
            confidence: Math.max(t1.confidence, t2.confidence),
            evidence: [...new Set([...t1.evidence, ...t2.evidence])],
            dependencies: [], // Dependencies could be merged or redefined
            contradictions: [...new Set([...t1.contradictions, ...t2.contradictions])],
            predictions: [...new Set([...t1.predictions, ...t2.predictions])],
            priority: Math.max(t1.priority, t2.priority),
            lifecycleState: ThoughtLifecycleState.ACTIVE,
            version: 1,
            researchTraceability: t1.researchTraceability,
            metadata: {},
            createdAt: Date.now(),
            updatedAt: Date.now()
        };

        t1.lifecycleState = ThoughtLifecycleState.MERGED;
        t2.lifecycleState = ThoughtLifecycleState.MERGED;

        this.persistence.save(merged);
        return merged;
    }
}
