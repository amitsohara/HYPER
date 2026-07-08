import { PlanObject, ResourceEstimate } from "../types.js";

export class ResourceAllocationEngine {
    estimate(plan: PlanObject): ResourceEstimate {
        const numTasks = Object.keys(plan.atomicTasks).length;
        
        return {
            specialistsRequired: ["GENERAL"],
            memoryUsage: numTasks * 10, // heuristic
            computationBudget: numTasks * 5,
            executionTimeMs: Array.from(Object.values(plan.atomicTasks)).reduce((sum, t) => sum + t.estimatedDurationMs, 0),
            parallelismOpportunities: Math.max(0, numTasks - 2)
        };
    }
}
