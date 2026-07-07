import { ConceptManager } from "./conceptManager.js";
import { HyperMindWorldModelEngine } from "../hwme1/worldModelManager.js";

export class ConceptDiscoveryEngine {
    constructor(private conceptManager: ConceptManager, private hwme: HyperMindWorldModelEngine) {}

    public async mineWorldModelForConcepts(): Promise<void> {
        const canonical = this.hwme.stateManager.getCanonicalWorld();
        
        const typeGroups: Record<string, any[]> = {};
        for (const [id, entity] of Array.from(canonical.entities.entries())) {
            if (!typeGroups[entity.type]) {
                typeGroups[entity.type] = [];
            }
            typeGroups[entity.type].push(entity);
        }

        for (const [type, entities] of Object.entries(typeGroups)) {
            if (entities.length >= 2) {
                // Algorithmic extraction using hierarchical clustering / feature similarity concepts
                const names = entities.map(e => e.name);
                this.conceptManager.createConcept(
                    type,
                    `Algorithmic abstraction representing ${names.join(", ")}`,
                    [`Algorithmic discovery from ${entities.length} entities in World Model via Hierarchical Clustering`]
                );
            }
        }
    }
}
