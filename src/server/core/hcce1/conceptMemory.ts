import { CanonicalConcept, ConceptLifecycleState } from "./types.js";

export class ConceptMemory {
    private concepts: Map<string, CanonicalConcept> = new Map();

    public save(concept: CanonicalConcept): void {
        this.concepts.set(concept.id, concept);
    }

    public get(id: string): CanonicalConcept | undefined {
        return this.concepts.get(id);
    }

    public delete(id: string): void {
        this.concepts.delete(id); // Usually we archive rather than delete
    }

    public getAll(): CanonicalConcept[] {
        return Array.from(this.concepts.values());
    }

    public getActiveConcepts(): CanonicalConcept[] {
        return this.getAll().filter(c => c.lifecycleState === ConceptLifecycleState.ACTIVE);
    }
}
