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
    | "ATTENTION_SHIFTED";

export interface StateEvent {
    id: string;
    type: EventType;
    payload: any;
    sourceModule: string;
    timestamp: number;
    version: number;
}

type EventHandler = (event: StateEvent) => void;

export class StateEventBus {
    private subscribers: Map<EventType | "*", EventHandler[]> = new Map();
    private eventHistory: StateEvent[] = [];

    subscribe(type: EventType | "*", handler: EventHandler) {
        if (!this.subscribers.has(type)) {
            this.subscribers.set(type, []);
        }
        this.subscribers.get(type)!.push(handler);
    }

    publish(event: Omit<StateEvent, "id" | "timestamp">) {
        const fullEvent: StateEvent = {
            ...event,
            id: Math.random().toString(36).substring(7),
            timestamp: Date.now()
        };
        this.eventHistory.push(fullEvent);
        
        const typeHandlers = this.subscribers.get(event.type) || [];
        const allHandlers = this.subscribers.get("*") || [];
        
        [...typeHandlers, ...allHandlers].forEach(handler => {
            try {
                handler(fullEvent);
            } catch(e) {
                console.warn(`Event handler error for ${event.type}:`, e);
            }
        });
    }

    getHistory(): StateEvent[] {
        return this.eventHistory;
    }
}
