import { MetaReasoningSession, ReasoningStrategy } from "./types.js";

export class MetaReasoningPersistence {
    private sessions: Map<string, MetaReasoningSession> = new Map();

    public save(session: MetaReasoningSession): void {
        this.sessions.set(session.id, session);
    }

    public get(id: string): MetaReasoningSession | undefined {
        return this.sessions.get(id);
    }

    public getAll(): MetaReasoningSession[] {
        return Array.from(this.sessions.values());
    }

    public delete(id: string): void {
        this.sessions.delete(id);
    }
}
