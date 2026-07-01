import { ThoughtObject } from "./types.js";

export class ThoughtPersistence {
    private thoughts: Map<string, ThoughtObject> = new Map();

    public save(thought: ThoughtObject): void {
        this.thoughts.set(thought.id, thought);
    }

    public get(id: string): ThoughtObject | undefined {
        return this.thoughts.get(id);
    }

    public getAll(): ThoughtObject[] {
        return Array.from(this.thoughts.values());
    }

    public delete(id: string): void {
        this.thoughts.delete(id);
    }
}
