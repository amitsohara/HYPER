import { ConceptMemory } from "./conceptMemory.js";
import { ConceptManager } from "./conceptManager.js";
import { CanonicalConcept } from "./types.js";

export class GeneralizationEngine {
    constructor(private memory: ConceptMemory, private conceptManager: ConceptManager) {}

    public generalizeConcepts(conceptIds: string[], newGroupName: string): CanonicalConcept | null {
        if (conceptIds.length < 2) return null;
        
        const concepts = conceptIds.map(id => this.memory.get(id)).filter(c => c !== undefined) as CanonicalConcept[];
        
        const groupConcept = this.conceptManager.createConcept(
            newGroupName,
            `Generalization of ${concepts.map(c => c.name).join(", ")}`,
            [`Generalized from ${conceptIds.length} concepts`]
        );

        for (const c of concepts) {
            c.parentConcepts.push(groupConcept.id);
            groupConcept.childConcepts.push(c.id);
            c.version++;
        }

        return groupConcept;
    }
}
