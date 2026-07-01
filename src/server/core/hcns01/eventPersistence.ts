import { CognitiveEvent } from "./types.js";

/**
 * Abstract interface for Event Persistence.
 * Implementations (e.g. Firebase, Postgres, Local File) must conform to this.
 */
export interface IEventPersistenceProvider {
    saveEvent(event: CognitiveEvent): Promise<void>;
    getEvent(id: string): Promise<CognitiveEvent | null>;
    queryEvents(criteria: any): Promise<CognitiveEvent[]>;
    archiveEvent(id: string): Promise<void>;
}

export class InMemoryEventPersistence implements IEventPersistenceProvider {
    private storage: Map<string, CognitiveEvent> = new Map();
    private archived: Set<string> = new Set();

    public async saveEvent(event: CognitiveEvent): Promise<void> {
        this.storage.set(event.id, event);
    }

    public async getEvent(id: string): Promise<CognitiveEvent | null> {
        return this.storage.get(id) || null;
    }

    public async queryEvents(criteria: any): Promise<CognitiveEvent[]> {
        // Simple in-memory query stub
        return Array.from(this.storage.values());
    }

    public async archiveEvent(id: string): Promise<void> {
        if (this.storage.has(id)) {
            this.archived.add(id);
        }
    }
}
