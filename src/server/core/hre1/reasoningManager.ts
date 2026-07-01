import { ReasoningSessionManager } from "./reasoningSessionManager.js";
import { StrategyExecutionLayer } from "./strategyExecutionLayer.js";
import { ExplanationEngine } from "./explanationEngine.js";
import { ConsistencyEngine } from "./consistencyEngine.js";
import { UncertaintyEngine } from "./uncertaintyEngine.js";
import { EvidenceEngine } from "./evidenceEngine.js";
import { HypothesisEngine } from "./hypothesisEngine.js";
import { ReasoningSession, Evidence } from "./types.js";

export class ReasoningManager {
    constructor(
        public sessionManager: ReasoningSessionManager,
        public strategyLayer: StrategyExecutionLayer,
        public explanationEngine: ExplanationEngine,
        public consistencyEngine: ConsistencyEngine,
        public uncertaintyEngine: UncertaintyEngine,
        public evidenceEngine: EvidenceEngine,
        public hypothesisEngine: HypothesisEngine
    ) {}

    public async executeReasoning(goal: string, inputs: string[], strategyName: string, evidenceSet: Evidence[], metadata: Record<string, any> = {}): Promise<ReasoningSession> {
        const rankedEvidence = this.evidenceEngine.rankEvidence(evidenceSet);
        const session = this.sessionManager.createSession(goal, inputs, strategyName, rankedEvidence);
        session.metadata = { ...session.metadata, ...metadata };

        await this.strategyLayer.executeStrategy(strategyName, session, rankedEvidence);

        // Post-execution processing
        const inconsistencies = this.consistencyEngine.checkConsistency(session);
        if (inconsistencies.length > 0) {
            session.metadata.inconsistencies = inconsistencies;
        }

        const uncertainty = this.uncertaintyEngine.quantifyUncertainty(session);
        session.metadata.uncertaintyScore = uncertainty;

        if (session.finalConclusions.length > 0) {
            for (const conc of session.finalConclusions) {
                if (!conc.explanation || Object.keys(conc.explanation).length === 0) {
                    conc.explanation = this.explanationEngine.generateExplanation(session, conc);
                }
            }
        }

        session.updatedAt = Date.now();
        session.version++;

        return session;
    }
}
