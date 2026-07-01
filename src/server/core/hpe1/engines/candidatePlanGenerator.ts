import { PlanObject, GoalObject, PlanStatus, ResourceEstimate, RiskAssessment, PlanEvaluation } from "../types.js";
import { IPlanningStrategy } from "../IPlanningStrategy.js";

export class CandidatePlanGenerator {
    private strategies: Map<string, IPlanningStrategy> = new Map();

    registerStrategy(strategy: IPlanningStrategy) {
        this.strategies.set(strategy.getName(), strategy);
    }

    async generateCandidates(goal: GoalObject, context: any): Promise<PlanObject[]> {
        const allCandidates: PlanObject[] = [];

        for (const strategy of this.strategies.values()) {
            const plans = await strategy.generatePlans(goal, context);
            allCandidates.push(...plans);
        }

        return allCandidates;
    }
}
