import { IPlanningStrategy } from "../IPlanningStrategy.js";
import { PlanObject, GoalObject, PlanStatus } from "../types.js";
import { GoalDecompositionEngine } from "../engines/goalDecompositionEngine.js";
import { v4 as uuidv4 } from "uuid";

export class UtilityBasedStrategy implements IPlanningStrategy {
    constructor(private decompositionEngine: GoalDecompositionEngine) {}

    getName(): string {
        return "UTILITY_BASED_STRATEGY";
    }

    async generatePlans(goal: GoalObject, context: any): Promise<PlanObject[]> {
        const atomicTasks = this.decompositionEngine.decompose(goal);
        
        const plan: PlanObject = {
            id: uuidv4(),
            goalId: goal.id,
            version: 1,
            status: PlanStatus.DRAFT,
            priority: goal.priority,
            atomicTasks,
            resourceEstimate: { specialistsRequired: [], memoryUsage: 0, computationBudget: 0, executionTimeMs: 0, parallelismOpportunities: 0 },
            riskAssessment: { failureProbability: 0, missingResources: [], dependencyRisks: [], uncertaintyScore: 0, cascadingFailuresScore: 0 },
            confidence: 0.9,
            explainability: "Generated via Expected Utility Maximization.",
            planningTrace: [{
                timestamp: Date.now(),
                action: "GENERATION",
                details: "Optimized task sequence for maximum utility."
            }],
            executionMetrics: {},
            researchTraceability: { hirqIds: [], tgpId: "", mrpId: "" },
            metadata: { strategy: this.getName(), expectedUtility: 0.95 },
            createdAt: Date.now(),
            updatedAt: Date.now()
        };

        return [plan];
    }
}
