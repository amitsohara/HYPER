import { ThoughtObject, ThoughtLifecycleState } from "./types.js";
import { ThoughtPersistence } from "./thoughtPersistence.js";

export class HypothesisManager {
    constructor(private persistence: ThoughtPersistence) {}

    public promoteToHypothesis(id: string): void {
        const thought = this.persistence.get(id);
        if (thought) {
            thought.metadata.isHypothesis = true;
            thought.metadata.verificationStatus = "PENDING";
            thought.version++;
            thought.updatedAt = Date.now();
        }
    }

    public resolveHypothesis(id: string, isVerified: boolean, evidence: string): void {
        const thought = this.persistence.get(id);
        if (thought && thought.metadata.isHypothesis) {
            thought.metadata.verificationStatus = isVerified ? "VERIFIED" : "FALSIFIED";
            thought.evidence.push(evidence);
            thought.confidence = isVerified ? 0.9 : 0.1;
            
            if (!isVerified) {
                thought.lifecycleState = ThoughtLifecycleState.REJECTED;
            } else {
                thought.lifecycleState = ThoughtLifecycleState.ACTIVE; // Verified hypothesis becomes a standard active thought
            }
            
            thought.version++;
            thought.updatedAt = Date.now();
        }
    }
}
