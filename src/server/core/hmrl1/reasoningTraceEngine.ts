import { MetaReasoningSession } from "./types.js";

export class ReasoningTraceEngine {
    private traces: Map<string, MetaReasoningSession[]> = new Map();

    public logSessionState(session: MetaReasoningSession): void {
        const history = this.traces.get(session.id) || [];
        // deep copy to persist state at this moment
        history.push(JSON.parse(JSON.stringify(session)));
        this.traces.set(session.id, history);
    }

    public replaySession(sessionId: string): MetaReasoningSession[] {
        return this.traces.get(sessionId) || [];
    }
}
