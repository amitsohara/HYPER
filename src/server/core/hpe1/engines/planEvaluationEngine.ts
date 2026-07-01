import { PlanObject, PlanEvaluation } from "../types.js";

export class PlanEvaluationEngine {
    evaluate(plan: PlanObject): PlanEvaluation {
        // Mock evaluation logic based on tasks and risk
        const expectedUtility = Math.random() * 0.5 + 0.5; // 0.5 to 1.0
        const efficiencyScore = 1.0 / (1.0 + (plan.resourceEstimate.executionTimeMs / 1000));
        const riskScore = plan.riskAssessment.failureProbability;
        
        const overallScore = (expectedUtility * 0.4) + (efficiencyScore * 0.3) - (riskScore * 0.3);

        return {
            expectedUtility,
            riskScore,
            confidenceScore: plan.confidence,
            complexityScore: plan.atomicTasks.size * 0.1,
            efficiencyScore,
            noveltyScore: 0.5,
            constraintSatisfaction: 1.0,
            overallScore: Math.max(0, Math.min(1, overallScore)),
            explainability: `Score: ${overallScore.toFixed(2)}. Utility: ${expectedUtility.toFixed(2)}, Risk: ${riskScore.toFixed(2)}.`
        };
    }
}
