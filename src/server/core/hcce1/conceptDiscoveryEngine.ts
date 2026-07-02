import { ConceptManager } from "./conceptManager.js";
import { HyperMindWorldModelEngine } from "../hwme1/worldModelManager.js";
import { HILASpecialist } from "../hila1/hilaSpecialist.js";
import { v4 as uuidv4 } from "uuid";

export class ConceptDiscoveryEngine {
    constructor(private conceptManager: ConceptManager, private hwme: HyperMindWorldModelEngine) {}

    public async mineWorldModelForConcepts(): Promise<void> {
        const canonical = this.hwme.stateManager.getCanonicalWorld();
        
        const entities = Array.from(canonical.entities.values()).map(e => ({
            id: e.id,
            name: e.name,
            type: e.type,
            properties: e.properties
        }));

        if (entities.length === 0) return;

        try {
            const hila = HILASpecialist.getInstance();
            if (hila && hila.arbitrator) {
                const request = {
                    id: uuidv4(),
                    missionId: "SYSTEM",
                    domain: "CONCEPT",
                    task: "Mine concepts from entities.",
                    context: { entities },
                    priority: 2,
                    requiredConfidence: 0.8
                };
                
                const arbitration = await hila.arbitrator.arbitrate(request, 0.3);
                
                if (arbitration.useExternal) {
                    const prompt = `Analyze these entities and extract 1-3 higher-level abstract concepts that categorize them or describe patterns.
Entities: ${JSON.stringify(entities, null, 2)}

Return a JSON array of objects with properties: "name" (string), "description" (string), "justification" (string).`;
                    
                    const response = await hila.arbitrator.executeExternal({...request, task: prompt}, arbitration);
                    
                    if (response && response.content) {
                        const parsed = JSON.parse(response.content);
                        for (const concept of parsed) {
                            this.conceptManager.createConcept(
                                concept.name,
                                concept.description,
                                [concept.justification]
                            );
                        }
                        return;
                    }
                }
            }
        } catch (e) {
            console.error("Failed to discover concepts with HILA:", e);
        }

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
