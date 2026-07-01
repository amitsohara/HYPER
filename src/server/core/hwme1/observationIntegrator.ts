import { HyperMindEventMesh } from "../hcns01/eventMesh.js";
import { CognitiveEvent, CognitiveDomain } from "../hcns01/types.js";
import { EntityManager } from "./entityManager.js";
import { RelationshipEngine } from "./relationshipEngine.js";
import { TemporalEngine } from "./temporalEngine.js";
import { CausalityEngine } from "./causalityEngine.js";
import { GoalModel } from "./goalModel.js";
import { ContextEngine } from "./contextEngine.js";

export class ObservationIntegrator {
    private hcns: HyperMindEventMesh;

    constructor(
        private entityManager: EntityManager,
        private relationshipEngine: RelationshipEngine,
        private temporalEngine: TemporalEngine,
        private causalityEngine: CausalityEngine,
        private goalModel: GoalModel,
        private contextEngine: ContextEngine
    ) {
        this.hcns = HyperMindEventMesh.getInstance();
    }

    public startListening(): void {
        this.hcns.subscribe("NEW_OBSERVATION", async (event: CognitiveEvent) => {
            await this.processObservation(event.payload);
        });
    }

    private async processObservation(payload: any): Promise<void> {
        // Pipeline: Observation -> Validation -> Entity Resolution -> Relationship Update -> Temporal -> Causality -> Goal -> Context -> World Revision
        
        if (payload.entity) {
            const id = this.entityManager.createEntity(payload.entity);
            if (payload.relationships) {
                for (const rel of payload.relationships) {
                    this.relationshipEngine.createRelationship({
                        ...rel,
                        sourceId: id
                    });
                }
            }
        }
        
        // Publish World Update
        this.hcns.publish({
            type: "WORLD_MODEL_UPDATED",
            domain: CognitiveDomain.SYSTEM,
            priority: 1, // NORMAL
            source: "HWME-01",
            payload: { timestamp: Date.now() }
        });
    }
}
