import { CanonicalConcept, ConceptRelationship } from "./types.js";
import { ConceptMemory } from "./conceptMemory.js";

export class ConceptRelationshipEngine {
    constructor(private memory: ConceptMemory) {}

    public addRelationship(sourceId: string, relationship: ConceptRelationship): void {
        const concept = this.memory.get(sourceId);
        if (concept) {
            concept.relatedConcepts.push(relationship);
            concept.version++;
        }
    }
}
