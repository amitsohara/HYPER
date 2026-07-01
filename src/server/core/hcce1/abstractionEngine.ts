import { ConceptMemory } from "./conceptMemory.js";
import { ConceptManager } from "./conceptManager.js";
import { CanonicalConcept } from "./types.js";

export class AbstractionEngine {
    constructor(private memory: ConceptMemory, private conceptManager: ConceptManager) {}

    public abstractConcept(conceptId: string, newParentName: string): CanonicalConcept | null {
        const child = this.memory.get(conceptId);
        if (!child) return null;

        const parent = this.conceptManager.createConcept(
            newParentName,
            `Higher order abstraction of ${child.name}`,
            [`Abstracted from ${child.id}`]
        );

        child.parentConcepts.push(parent.id);
        parent.childConcepts.push(child.id);
        
        child.version++;
        return parent;
    }
}
