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

export class MemoryEventBus {
    private static instance: MemoryEventBus;
    private listeners: Record<string, ((data: any) => void)[]> = {};

    private constructor() {}

    public static getInstance(): MemoryEventBus {
        if (!MemoryEventBus.instance) {
            MemoryEventBus.instance = new MemoryEventBus();
        }
        return MemoryEventBus.instance;
    }

    public subscribe(event: MemoryEvents, callback: (data: any) => void) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }

    public publish(event: MemoryEvents, data: any) {
        console.log(`[HEM Event] ${event}`, data);
        if (this.listeners[event]) {
            this.listeners[event].forEach(cb => cb(data));
        }
    }
}
