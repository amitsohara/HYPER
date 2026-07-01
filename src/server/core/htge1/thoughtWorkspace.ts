import { ThoughtObject, ThoughtLifecycleState } from "./types.js";
import { ThoughtPersistence } from "./thoughtPersistence.js";

export class ThoughtWorkspace {
    private capacity: number = 20;

    constructor(private persistence: ThoughtPersistence) {}

    public getActiveThoughts(): ThoughtObject[] {
        return this.persistence.getAll().filter(t => t.lifecycleState === ThoughtLifecycleState.ACTIVE);
    }

    public enforceCapacity(): void {
        const active = this.getActiveThoughts();
        if (active.length > this.capacity) {
            // Sort by priority ascending and suspend the lowest priority ones
            const sorted = active.sort((a, b) => a.priority - b.priority);
            const toSuspend = sorted.slice(0, active.length - this.capacity);
            
            for (const t of toSuspend) {
                t.lifecycleState = ThoughtLifecycleState.SUSPENDED;
                t.version++;
                t.updatedAt = Date.now();
            }
        }
    }

    public clearWorkspace(): void {
        const active = this.getActiveThoughts();
        for (const t of active) {
            t.lifecycleState = ThoughtLifecycleState.ARCHIVED;
            t.version++;
            t.updatedAt = Date.now();
        }
    }
}
