import { ThinkingSession } from "./thinking_session.js";
import { SessionStatus } from "./thinking_types.js";
import { ThinkingCycle } from "./thinking_cycle.js";
import { ThinkingLogger } from "./thinking_logger.js";

export class ThinkingOrchestrator {
    private sessions: Map<string, ThinkingSession> = new Map();
    private activeIntervals: Map<string, NodeJS.Timeout> = new Map();
    
    createSession(mission: string): ThinkingSession {
        const session = new ThinkingSession(mission);
        this.sessions.set(session.session_id, session);
        ThinkingLogger.log(session.session_id, `Session created for mission: ${mission}`);
        return session;
    }
    
    getSession(id: string): ThinkingSession | undefined {
        return this.sessions.get(id);
    }
    
    startSession(id: string) {
        const session = this.sessions.get(id);
        if (session && session.status !== SessionStatus.RUNNING && session.status !== SessionStatus.COMPLETED) {
            session.status = SessionStatus.RUNNING;
            ThinkingLogger.log(id, "Session started.");
            
            // In a real distributed system, we'd use a background worker queue.
            // For now, we simulate a cognitive loop with setInterval
            const interval = setInterval(() => {
                if (session.status !== SessionStatus.RUNNING) {
                    clearInterval(interval);
                    this.activeIntervals.delete(id);
                    return;
                }
                ThinkingCycle.tick(session);
            }, 50); // 50ms tick
            this.activeIntervals.set(id, interval);
        }
    }
    
    pauseSession(id: string) {
        const session = this.sessions.get(id);
        if (session && session.status === SessionStatus.RUNNING) {
            session.status = SessionStatus.PAUSED;
            const interval = this.activeIntervals.get(id);
            if (interval) {
                clearInterval(interval);
                this.activeIntervals.delete(id);
            }
            ThinkingLogger.log(id, "Session paused. Checkpoint saved.");
            session.saveCheckpoint();
        }
    }
    
    resumeSession(id: string) {
        this.startSession(id);
    }
    
    cancelSession(id: string) {
        const session = this.sessions.get(id);
        if (session) {
            session.status = SessionStatus.CANCELLED;
            const interval = this.activeIntervals.get(id);
            if (interval) {
                clearInterval(interval);
                this.activeIntervals.delete(id);
            }
            ThinkingLogger.log(id, "Session cancelled.");
        }
    }
}
