import { IPlanningStrategy } from "../IPlanningStrategy.js";
import { PlanObject, GoalObject, PlanStatus } from "../types.js";
import { GoalDecompositionEngine } from "../engines/goalDecompositionEngine.js";
import { v4 as uuidv4 } from "uuid";

export class HTNStrategy implements IPlanningStrategy {
    constructor(private decompositionEngine: GoalDecompositionEngine) {}

    getName(): string {
        return "HTN_STRATEGY";
    }

    async generatePlans(goal: GoalObject, context: any): Promise<PlanObject[]> {
        const atomicTasks = await this.decompositionEngine.decompose(goal);
        
        const plan: PlanObject = {
            id: uuidv4(),
            goalId: goal.id,
            version: 1,
            status: PlanStatus.DRAFT,
            priority: goal.priority,
            atomicTasks,
            resourceEstimate: { specialistsRequired: [], memoryUsage: 0, computationBudget: 0, executionTimeMs: 0, parallelismOpportunities: 0 },
            riskAssessment: { failureProbability: 0, missingResources: [], dependencyRisks: [], uncertaintyScore: 0, cascadingFailuresScore: 0 },
            confidence: 0.8,
            explainability: "Generated via Hierarchical Task Network decomposition.",
            planningTrace: [{
                timestamp: Date.now(),
                action: "GENERATION",
                details: "Decomposed goal into atomic tasks using HTN strategy."
            }],
            executionMetrics: {},
            researchTraceability: { hirqIds: [], tgpId: "", mrpId: "" },
            metadata: { strategy: this.getName() },
            createdAt: Date.now(),
            updatedAt: Date.now()
        };

        return [plan];
    }
}
