import { CognitiveState } from "./cognitive_state.js";

export interface WorkingMemoryItem {
    id: string;
    fact: string;
    timestamp: number;
    relevance: number; // 0-1
}

export class WorkingMemory {
    private items: WorkingMemoryItem[] = [];
    private capacity: number;

    constructor(capacity: number = 20) {
        this.capacity = capacity;
    }

    addFact(fact: string, relevance: number = 0.5) {
        const item: WorkingMemoryItem = {
            id: Math.random().toString(36).substring(7),
            fact,
            timestamp: Date.now(),
            relevance
        };
        
        this.items.push(item);
        this.items.sort((a, b) => b.relevance - a.relevance);
        
        if (this.items.length > this.capacity) {
            // Evict lowest relevance/oldest
            this.items.pop();
        }
    }

    getItems() {
        return this.items;
    }

    getStateRepresentation() {
        return this.items.map(i => i.fact);
    }
}
