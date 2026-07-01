import { CognitiveSession, SocietyState } from "./types.js";
import { v4 as uuidv4 } from "uuid";
import { HCNSAdapter } from "./hcnsAdapter.js";

export class CognitiveSessionManager {
    private sessions: Map<string, CognitiveSession> = new Map();

    constructor(private hcnsAdapter: HCNSAdapter) {}

    public createSession(goals: string[]): string {
        const sessionId = uuidv4();
        const session: CognitiveSession = {
            sessionId,
            goals,
            participants: [],
            state: SocietyState.INITIALIZING,
            timeline: [],
            decisionHistory: []
        };
        this.sessions.set(sessionId, session);
        
        session.timeline.push({
            timestamp: Date.now(),
            eventId: "session-created",
            description: "Session Created"
        });

        this.hcnsAdapter.publishSessionCreated(sessionId, goals);
        return sessionId;
    }

    public getSession(sessionId: string): CognitiveSession | undefined {
        return this.sessions.get(sessionId);
    }

    public addParticipant(sessionId: string, specialistId: string): void {
        const session = this.sessions.get(sessionId);
        if (session && !session.participants.includes(specialistId)) {
            session.participants.push(specialistId);
        }
    }

    public updateSessionState(sessionId: string, state: SocietyState): void {
        const session = this.sessions.get(sessionId);
        if (session) {
            session.state = state;
            session.timeline.push({
                timestamp: Date.now(),
                eventId: `state-transition`,
                description: `Transitioned to ${state}`
            });
        }
    }

    public closeSession(sessionId: string, finalOutcome: string): void {
        const session = this.sessions.get(sessionId);
        if (session) {
            session.finalOutcome = finalOutcome;
            this.updateSessionState(sessionId, SocietyState.IDLE);
        }
    }
}
