import { ConceptManager } from "./conceptManager.js";
import { HyperMindWorldModelEngine } from "../hwme1/worldModelManager.js";

export class ConceptDiscoveryEngine {
    constructor(private conceptManager: ConceptManager, private hwme: HyperMindWorldModelEngine) {}

    public mineWorldModelForConcepts(): void {
        const canonical = this.hwme.stateManager.getCanonicalWorld();
        
        // Mock pattern discovery: look for entities with same type
        const typeGroups: Record<string, string[]> = {};
        for (const [id, entity] of canonical.entities.entries()) {
            if (!typeGroups[entity.type]) {
                typeGroups[entity.type] = [];
            }
            typeGroups[entity.type].push(entity.name);
        }

        for (const [type, names] of Object.entries(typeGroups)) {
            if (names.length >= 2) {
                // If we see multiple things of the same type, we might want to ensure a concept exists for it
                this.conceptManager.createConcept(
                    type,
                    `An abstraction for ${names.join(", ")}`,
                    [`Discovered from ${names.length} entities in HWME`]
                );
            }
        }
    }
}
