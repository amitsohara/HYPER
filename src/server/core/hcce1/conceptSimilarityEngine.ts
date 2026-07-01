import { ConceptMemory } from "./conceptMemory.js";

export class ConceptSimilarityEngine {
    constructor(private memory: ConceptMemory) {}

    public calculateSimilarity(id1: string, id2: string): number {
        const c1 = this.memory.get(id1);
        const c2 = this.memory.get(id2);
        
        if (!c1 || !c2) return 0;
        
        let score = 0;
        // Mock similarity logic based on shared parents
        const sharedParents = c1.parentConcepts.filter(p => c2.parentConcepts.includes(p));
        if (sharedParents.length > 0) score += 0.5;

        // Mock similarity logic based on common relationships
        const c1Targets = c1.relatedConcepts.map(r => r.targetId);
        const c2Targets = c2.relatedConcepts.map(r => r.targetId);
        const sharedRels = c1Targets.filter(t => c2Targets.includes(t));
        
        if (sharedRels.length > 0) score += 0.3;

        return Math.min(1.0, score);
    }
}
