import { ConceptMemory } from "./conceptMemory.js";
import { ConceptManager } from "./conceptManager.js";
import { CanonicalConcept } from "./types.js";

export class SpecializationEngine {
    constructor(private memory: ConceptMemory, private conceptManager: ConceptManager) {}

    public specializeConcept(parentId: string, newChildName: string, distinguishingFeature: string): CanonicalConcept | null {
        const parent = this.memory.get(parentId);
        if (!parent) return null;

        const child = this.conceptManager.createConcept(
            newChildName,
            `Specialization of ${parent.name} with feature: ${distinguishingFeature}`,
            [`Specialized from ${parent.id}`]
        );

        child.parentConcepts.push(parent.id);
        parent.childConcepts.push(child.id);
        parent.version++;

        return child;
    }
}
