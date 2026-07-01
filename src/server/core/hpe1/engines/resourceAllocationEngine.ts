import { PlanObject, ResourceEstimate } from "../types.js";

export class ResourceAllocationEngine {
    estimate(plan: PlanObject): ResourceEstimate {
        const numTasks = plan.atomicTasks.size;
        
        return {
            specialistsRequired: ["GENERAL"],
            memoryUsage: numTasks * 10, // heuristic
            computationBudget: numTasks * 5,
            executionTimeMs: Array.from(plan.atomicTasks.values()).reduce((sum, t) => sum + t.estimatedDurationMs, 0),
            parallelismOpportunities: Math.max(0, numTasks - 2)
        };
    }
}
