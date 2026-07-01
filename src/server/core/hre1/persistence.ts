import { ReasoningSession } from "./types.js";

export class ReasoningPersistence {
    private sessions: Map<string, ReasoningSession> = new Map();

    public save(session: ReasoningSession): void {
        this.sessions.set(session.id, session);
    }

    public get(id: string): ReasoningSession | undefined {
        return this.sessions.get(id);
    }

    public getAll(): ReasoningSession[] {
        return Array.from(this.sessions.values());
    }

    public delete(id: string): void {
        this.sessions.delete(id);
    }
}
