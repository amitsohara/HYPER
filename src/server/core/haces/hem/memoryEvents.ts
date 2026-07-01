import { HyperMindEventMesh, CognitiveDomain, EventPriority } from "../../hcns01/index.js";

export enum MemoryEvents {
    EVOLUTION_RECORDED = "HEM_EVOLUTION_RECORDED",
    KNOWLEDGE_CONSOLIDATED = "HEM_KNOWLEDGE_CONSOLIDATED",
    REFLECTION_GENERATED = "HEM_REFLECTION_GENERATED",
    LESSON_LEARNED = "HEM_LESSON_LEARNED",
    DECISION_ARCHIVED = "HEM_DECISION_ARCHIVED",
    NARRATIVE_GENERATED = "HEM_NARRATIVE_GENERATED",
    KNOWLEDGE_RETRIEVED = "HEM_KNOWLEDGE_RETRIEVED",
    CAUSAL_RELATIONSHIP_DISCOVERED = "HEM_CAUSAL_RELATIONSHIP_DISCOVERED",
    INSTITUTIONAL_KNOWLEDGE_UPDATED = "HEM_INSTITUTIONAL_KNOWLEDGE_UPDATED",
    MEMORY_SNAPSHOT_CREATED = "HEM_MEMORY_SNAPSHOT_CREATED",
    COGNITIVE_EXPERIENCE_SYNTHESIZED = "HEM_COGNITIVE_EXPERIENCE_SYNTHESIZED"
}

// Register these schemas so the Mesh allows them
const mesh = HyperMindEventMesh.getInstance();
Object.values(MemoryEvents).forEach(type => {
    if (!mesh.registry.isRegistered(type)) {
        mesh.registerEventType({
            type,
            domain: CognitiveDomain.MEMORY,
            description: `Memory Event: ${type}`
        });
    }
});

/**
 * Backward compatible facade pointing to HyperMindEventMesh (HCNS-01)
 */
export class MemoryEventBus {
    private static instance: MemoryEventBus;
    private mesh = HyperMindEventMesh.getInstance();

    private constructor() {}

    public static getInstance(): MemoryEventBus {
        if (!MemoryEventBus.instance) {
            MemoryEventBus.instance = new MemoryEventBus();
        }
        return MemoryEventBus.instance;
    }

    public subscribe(event: MemoryEvents, callback: (data: any) => void) {
        this.mesh.subscribe(event, (meshEvent) => {
            callback(meshEvent.payload);
        });
    }

    public publish(event: MemoryEvents, data: any) {
        console.log(`[HCNS-01] [HEM] Publishing: ${event}`);
        this.mesh.publish({
            type: event,
            domain: CognitiveDomain.MEMORY,
            priority: EventPriority.NORMAL,
            source: "HEM",
            payload: data
        });
    }
}

