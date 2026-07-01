import { ThoughtObject, ThoughtLifecycleState } from "./types.js";
import { ThoughtPersistence } from "./thoughtPersistence.js";

export class ReflectionEngineAdapter {
    constructor(private persistence: ThoughtPersistence) {}

    public annotateThought(id: string, specialistId: string, annotation: string): void {
        const thought = this.persistence.get(id);
        if (thought) {
            if (!thought.metadata.annotations) {
                thought.metadata.annotations = [];
            }
            thought.metadata.annotations.push({ specialistId, annotation, timestamp: Date.now() });
            thought.version++;
            thought.updatedAt = Date.now();
        }
    }

    public challengeThought(id: string, specialistId: string, reason: string): void {
        const thought = this.persistence.get(id);
        if (thought) {
            this.annotateThought(id, specialistId, `CHALLENGED: ${reason}`);
            thought.confidence = Math.max(0, thought.confidence - 0.2); // Reduce confidence
            thought.version++;
        }
    }

    public confirmThought(id: string, specialistId: string, reason: string): void {
        const thought = this.persistence.get(id);
        if (thought) {
            this.annotateThought(id, specialistId, `CONFIRMED: ${reason}`);
            thought.confidence = Math.min(1.0, thought.confidence + 0.1);
            thought.version++;
        }
    }
}
