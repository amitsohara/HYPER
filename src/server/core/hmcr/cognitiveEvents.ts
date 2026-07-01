import { HyperMindEventMesh, CognitiveDomain, EventPriority } from "../hcns01/index.js";

export enum CognitiveEvents {
    COGNITIVE_CYCLE_STARTED = "HMCR_COGNITIVE_CYCLE_STARTED",
    SPECIALIST_ACTIVATED = "HMCR_SPECIALIST_ACTIVATED",
    HYPOTHESIS_GENERATED = "HMCR_HYPOTHESIS_GENERATED",
    REASONING_COMPLETED = "HMCR_REASONING_COMPLETED",
    SIMULATION_COMPLETED = "HMCR_SIMULATION_COMPLETED",
    VERIFICATION_COMPLETED = "HMCR_VERIFICATION_COMPLETED",
    DECISION_MADE = "HMCR_DECISION_MADE",
    REFLECTION_COMPLETED = "HMCR_REFLECTION_COMPLETED",
    LEARNING_COMPLETED = "HMCR_LEARNING_COMPLETED",
    TOOL_REQUESTED = "HMCR_TOOL_REQUESTED",
    TOOL_REJECTED = "HMCR_TOOL_REJECTED",
    COGNITIVE_CYCLE_FINISHED = "HMCR_COGNITIVE_CYCLE_FINISHED",
    BLACKBOARD_UPDATED = "HMCR_BLACKBOARD_UPDATED"
}

// Register these schemas so the Mesh allows them
const mesh = HyperMindEventMesh.getInstance();
Object.values(CognitiveEvents).forEach(type => {
    if (!mesh.registry.isRegistered(type)) {
        mesh.registerEventType({
            type,
            domain: CognitiveDomain.REASONING,
            description: `Cognitive Event: ${type}`
        });
    }
});

/**
 * Backward compatible facade pointing to HyperMindEventMesh (HCNS-01)
 */
export class CognitiveEventBus {
    private static instance: CognitiveEventBus;
    private mesh = HyperMindEventMesh.getInstance();

    private constructor() {}

    public static getInstance(): CognitiveEventBus {
        if (!CognitiveEventBus.instance) {
            CognitiveEventBus.instance = new CognitiveEventBus();
        }
        return CognitiveEventBus.instance;
    }

    public subscribe(event: CognitiveEvents, callback: (data: any) => void) {
        this.mesh.subscribe(event, (meshEvent) => {
            callback(meshEvent.payload);
        });
    }

    public publish(event: CognitiveEvents, data: any) {
        console.log(`[HCNS-01] [HMCR] Publishing: ${event}`, data?.session_id ? `Session: ${data.session_id}` : "");
        this.mesh.publish({
            type: event,
            domain: CognitiveDomain.REASONING,
            priority: EventPriority.NORMAL,
            source: "HMCR",
            sessionId: data?.session_id,
            payload: data
        });
    }
}

