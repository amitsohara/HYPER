import { ConceptMemory } from "./conceptMemory.js";
import { CanonicalConcept } from "./types.js";

export class ConceptHierarchyEngine {
    constructor(private memory: ConceptMemory) {}

    public getHierarchy(rootId: string, depth: number = 2): any {
        const root = this.memory.get(rootId);
        if (!root) return null;

        if (depth === 0) return { id: root.id, name: root.name, children: [] };

        const children = root.childConcepts
            .map(cId => this.getHierarchy(cId, depth - 1))
            .filter(c => c !== null);

        return {
            id: root.id,
            name: root.name,
            children
        };
    }
}
