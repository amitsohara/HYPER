import { EvolutionEvent, EvolutionEventType } from "./memoryTypes.js";
import { MemoryEventBus, MemoryEvents } from "./memoryEvents.js";
import { MemoryMetrics } from "./memoryMetrics.js";

export class HistoryManager {
    private eventBus = MemoryEventBus.getInstance();
    private events: Map<string, EvolutionEvent> = new Map();

    public recordEvent(event: EvolutionEvent) {
        // Immutable append
        if (!this.events.has(event.event_id)) {
            this.events.set(event.event_id, Object.freeze({ ...event }));
            MemoryMetrics.recordEvent();
            this.eventBus.publish(MemoryEvents.EVOLUTION_RECORDED, event);
        }
    }

    public getEvent(event_id: string): EvolutionEvent | undefined {
        return this.events.get(event_id);
    }

    public getAllEvents(): EvolutionEvent[] {
        return Array.from(this.events.values()).sort((a, b) => a.timestamp - b.timestamp);
    }

    public getEventsByType(type: EvolutionEventType): EvolutionEvent[] {
        return this.getAllEvents().filter(e => e.type === type);
    }
}
