import { ReasoningSession, Evidence } from "./types.js";
import { ReasoningPersistence } from "./persistence.js";
import { InferenceGraphEngine } from "./inferenceGraphEngine.js";
import { v4 as uuidv4 } from "uuid";

export class ReasoningSessionManager {
    constructor(
        private persistence: ReasoningPersistence,
        private graphEngine: InferenceGraphEngine
    ) {}

    public createSession(goal: string, inputs: string[], strategy: string, evidenceSet: Evidence[]): ReasoningSession {
        const session: ReasoningSession = {
            id: uuidv4(),
            goal,
            inputs,
            selectedStrategy: strategy,
            evidenceSet,
            hypotheses: [],
            inferenceGraph: this.graphEngine.createGraph(),
            intermediateConclusions: [],
            finalConclusions: [],
            alternativeConclusions: [],
            overallConfidence: 0,
            executionMetrics: {},
            researchTraceability: {
                hirqIds: [],
                tgpId: "TGP-001",
                mrpId: "MRP-001"
            },
            version: 1,
            metadata: {},
            createdAt: Date.now(),
            updatedAt: Date.now()
        };

        this.persistence.save(session);
        return session;
    }

    public getSession(id: string): ReasoningSession | undefined {
        return this.persistence.get(id);
    }
}
