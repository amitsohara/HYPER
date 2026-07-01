import { HyperMindEventMesh, CognitiveDomain, EventPriority } from "../hcns01/index.js";

export type EventType = 
    | "MISSION_STARTED"
    | "RESEARCH_COMPLETED"
    | "SIMULATION_UPDATED"
    | "RISK_IDENTIFIED"
    | "BUDGET_CHANGED"
    | "DECISION_UPDATED"
    | "LEARNING_ADDED"
    | "MISSION_STAGE_CHANGED"
    | "EVIDENCE_ADDED"
    | "GOAL_COMPLETED"
    | "ATTENTION_SHIFTED"
    | "LEARNING_CYCLE_COMPLETED";

export interface StateEvent {
    id: string;
    type: EventType;
    payload: any;
    sourceModule: string;
    timestamp: number;
    version: number;
}

type EventHandler = (event: StateEvent) => void;

// Register these schemas so the Mesh allows them
const mesh = HyperMindEventMesh.getInstance();
const types: EventType[] = [
    "MISSION_STARTED", "RESEARCH_COMPLETED", "SIMULATION_UPDATED", "RISK_IDENTIFIED",
    "BUDGET_CHANGED", "DECISION_UPDATED", "LEARNING_ADDED", "MISSION_STAGE_CHANGED",
    "EVIDENCE_ADDED", "GOAL_COMPLETED", "ATTENTION_SHIFTED", "LEARNING_CYCLE_COMPLETED"
];
types.forEach(type => {
    if (!mesh.registry.isRegistered(type)) {
        mesh.registerEventType({
            type,
            domain: CognitiveDomain.SYSTEM, // State bus tends to act at a system/orchestration level
            description: `State Event: ${type}`
        });
    }
});

/**
 * Backward compatible facade pointing to HyperMindEventMesh (HCNS-01)
 */
export class StateEventBus {
    private mesh = HyperMindEventMesh.getInstance();
    private _subMap = new Map<string, string>(); // to allow keeping track of HCNS subscriptions if needed

    subscribe(type: EventType | "*", handler: EventHandler) {
        this.mesh.subscribe(type, (meshEvent) => {
            const stateEvent: StateEvent = {
                id: meshEvent.id,
                type: meshEvent.type as EventType,
                payload: meshEvent.payload,
                sourceModule: meshEvent.source,
                timestamp: meshEvent.timestamp,
                version: meshEvent.metadata?.version || 1
            };
            try {
                handler(stateEvent);
            } catch(e) {
                console.warn(`Event handler error for ${stateEvent.type}:`, e);
            }
        });
    }

    publish(event: Omit<StateEvent, "id" | "timestamp">) {
        console.log(`[HCNS-01] [HCC] Publishing: ${event.type}`);
        this.mesh.publish({
            type: event.type,
            domain: CognitiveDomain.SYSTEM,
            priority: EventPriority.NORMAL,
            source: event.sourceModule,
            payload: event.payload,
            metadata: { version: event.version }
        });
    }

    getHistory(): StateEvent[] {
        // As a temporary polyfill, we query the trace manager / persistence
        // For accurate history, we should fetch from the persistence provider.
        // We'll return an empty array for now since HCNS handles history via persistence.
        return [];
    }
}

