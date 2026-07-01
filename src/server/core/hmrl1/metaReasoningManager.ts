import { MetaReasoningSession, ReasoningStrategy } from "./types.js";
import { MetaReasoningPersistence } from "./persistence.js";
import { StrategySelectionEngine } from "./strategySelectionEngine.js";
import { ConfidenceCalibrationEngine } from "./confidenceCalibrationEngine.js";
import { BiasDetectionEngine } from "./biasDetectionEngine.js";
import { ReflectionEngine } from "./reflectionEngine.js";
import { ReasoningTraceEngine } from "./reasoningTraceEngine.js";
import { v4 as uuidv4 } from "uuid";

export class MetaReasoningManager {
    constructor(
        private persistence: MetaReasoningPersistence,
        private strategyEngine: StrategySelectionEngine,
        private confidenceEngine: ConfidenceCalibrationEngine,
        private biasEngine: BiasDetectionEngine,
        private reflectionEngine: ReflectionEngine,
        public traceEngine: ReasoningTraceEngine
    ) {}

    public startSession(goalContext: string, evidenceSummary: string, evidenceCount: number): MetaReasoningSession {
        // Create an array of length evidenceCount to pass to the strategy engine
        const evidenceArr = new Array(evidenceCount).fill("evidence");
        const strategy = this.strategyEngine.selectStrategy(goalContext, evidenceArr);
        const alternatives = this.strategyEngine.getAlternatives(strategy);
        
        const session: MetaReasoningSession = {
            id: uuidv4(),
            reasoningSessionId: uuidv4(),
            selectedStrategy: strategy,
            alternativeStrategies: alternatives,
            evidenceSummary,
            confidence: 0.5, // initial
            biasReports: [],
            reflections: [],
            activeHypothesisIds: [],
            contradictionIds: [],
            recommendations: [],
            revisionHistory: 0,
            performanceMetrics: {},
            researchTraceability: {
                hirqIds: [],
                mrpId: "MRP-001",
                hctIds: []
            },
            version: 1,
            metadata: {},
            createdAt: Date.now(),
            updatedAt: Date.now()
        };

        this.persistence.save(session);
        this.traceEngine.logSessionState(session);
        return session;
    }

    public evaluateState(sessionId: string, evidenceCount: number, contradictionsCount: number): void {
        const session = this.persistence.get(sessionId);
        if (!session) return;

        session.biasReports = this.biasEngine.detectBias(session.activeHypothesisIds.length, evidenceCount, contradictionsCount);
        
        const maxBias = session.biasReports.reduce((max, b) => Math.max(max, b.severity), 0);
        session.confidence = this.confidenceEngine.estimateConfidence(0.8, 0.8, maxBias);

        session.version++;
        session.updatedAt = Date.now();
        
        this.traceEngine.logSessionState(session);
    }

    public runReflection(sessionId: string, isGoalMet: boolean): void {
        const session = this.persistence.get(sessionId);
        if (!session) return;

        const reflection = this.reflectionEngine.evaluateSession(session, isGoalMet);
        if (reflection.suggestedStrategyChange) {
            session.selectedStrategy = reflection.suggestedStrategyChange;
            session.alternativeStrategies = this.strategyEngine.getAlternatives(session.selectedStrategy);
        }
        
        this.traceEngine.logSessionState(session);
    }

    public getSession(sessionId: string): MetaReasoningSession | undefined {
        return this.persistence.get(sessionId);
    }
}
