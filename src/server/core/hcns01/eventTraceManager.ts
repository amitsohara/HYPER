import { CognitiveEvent, EventTrace, EventLifecycleStatus } from "./types.js";

export class EventTraceManager {
    private traces: Map<string, EventTrace> = new Map();

    public initializeTrace(event: CognitiveEvent, parentEventId?: string): void {
        const trace: EventTrace = {
            eventId: event.id,
            traceId: event.traceId || event.id,
            correlationId: event.correlationId,
            parentEventId,
            timestamp: event.timestamp,
            lifecycleHistory: [
                {
                    status: EventLifecycleStatus.CREATED,
                    timestamp: Date.now()
                }
            ]
        };
        this.traces.set(event.id, trace);
    }

    public updateLifecycle(eventId: string, status: EventLifecycleStatus, details?: string): void {
        const trace = this.traces.get(eventId);
        if (trace) {
            trace.lifecycleHistory.push({
                status,
                timestamp: Date.now(),
                details
            });
        }
    }

    public getTrace(eventId: string): EventTrace | undefined {
        return this.traces.get(eventId);
    }
    
    public getAllTraces(): EventTrace[] {
        return Array.from(this.traces.values());
    }
}
