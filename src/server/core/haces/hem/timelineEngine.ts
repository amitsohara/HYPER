import { EvolutionEvent } from "./memoryTypes.js";
import { HistoryManager } from "./historyManager.js";

export class TimelineEngine {
    constructor(private history: HistoryManager) {}

    public getTimeline(period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY' | 'ALL', startMs?: number, endMs?: number): EvolutionEvent[] {
        let events = this.history.getAllEvents();
        
        if (startMs) {
            events = events.filter(e => e.timestamp >= startMs);
        }
        if (endMs) {
            events = events.filter(e => e.timestamp <= endMs);
        }

        // Return chronological order
        return events;
    }

    public getLineage(type: 'CAPABILITY' | 'ARCHITECTURE' | 'ENGINEERING', targetId: string): EvolutionEvent[] {
        // A naive implementation that filters events referencing the targetId in payload
        return this.history.getAllEvents().filter(e => {
            if (e.payload && typeof e.payload === 'object') {
                return JSON.stringify(e.payload).includes(targetId);
            }
            return false;
        });
    }
}
