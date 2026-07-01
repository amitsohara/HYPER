import { MetaReasoningSession, ReasoningReflection, ReasoningStrategy } from "./types.js";

export class ReflectionEngine {
    public evaluateSession(session: MetaReasoningSession, isGoalMet: boolean): ReasoningReflection {
        const biasSeverity = session.biasReports.reduce((acc, r) => acc + r.severity, 0);
        
        const reflection: ReasoningReflection = {
            goalAchieved: isGoalMet,
            confidenceAcceptable: session.confidence > 0.7 && biasSeverity < 0.5,
            additionalEvidenceRequired: session.confidence < 0.5,
            reviseHypotheses: biasSeverity >= 0.6 || session.contradictionIds.length > 1,
            recommendations: [],
            timestamp: Date.now()
        };

        if (reflection.additionalEvidenceRequired) {
            reflection.recommendations.push("Gather more evidence to increase confidence.");
        }

        if (reflection.reviseHypotheses) {
            reflection.recommendations.push("Re-evaluate hypotheses due to high bias or contradictions.");
            reflection.suggestedStrategyChange = ReasoningStrategy.ABDUCTIVE;
        }

        if (!isGoalMet && session.confidence > 0.8) {
            reflection.recommendations.push("High confidence but goal not met: check for circular reasoning or incorrect premises.");
            reflection.suggestedStrategyChange = session.alternativeStrategies[0] || ReasoningStrategy.HYBRID;
        }

        session.reflections.push(reflection);
        session.version++;
        session.updatedAt = Date.now();

        return reflection;
    }
}
