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

export class CognitiveEventBus {
    private static instance: CognitiveEventBus;
    private listeners: Record<string, ((data: any) => void)[]> = {};

    private constructor() {}

    public static getInstance(): CognitiveEventBus {
        if (!CognitiveEventBus.instance) {
            CognitiveEventBus.instance = new CognitiveEventBus();
        }
        return CognitiveEventBus.instance;
    }

    public subscribe(event: CognitiveEvents, callback: (data: any) => void) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }

    public publish(event: CognitiveEvents, data: any) {
        console.log(`[HMCR Event] ${event}`, data?.session_id ? `Session: ${data.session_id}` : "");
        if (this.listeners[event]) {
            this.listeners[event].forEach(cb => cb(data));
        }
    }
}
