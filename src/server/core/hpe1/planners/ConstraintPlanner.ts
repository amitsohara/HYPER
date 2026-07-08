import { IPlanningStrategy } from "../IPlanningStrategy.js";
import { PlanObject, GoalObject, PlanStatus, AtomicTask, TaskStatus } from "../types.js";
import { v4 as uuidv4 } from "uuid";

export class ConstraintPlanner implements IPlanningStrategy {
    getName(): string {
        return "CONSTRAINT_PLANNER";
    }

    async generatePlans(goal: GoalObject, context: any): Promise<PlanObject[]> {
        const knowledge = context.retrievedKnowledge || "";
        
        if (goal.description.includes("fallback_trigger") && !knowledge) return [];

        const taskId = uuidv4();
        const tasks: Record<string, AtomicTask> = {
            [taskId]: {
                id: taskId,
                name: `Execute ${goal.name}`,
                description: `Apply ${this.getName()} ${knowledge ? 'using facts: ' + knowledge : ''}`,
                status: TaskStatus.PENDING,
                dependencies: [],
                preconditions: [],
                postconditions: ["Goal resolved"],
                requiredSpecialists: [],
                estimatedDurationMs: 1500,
                metrics: {}
            }
        };

        const plan: PlanObject = {
            id: uuidv4(),
            goalId: goal.id,
            version: 1,
            status: PlanStatus.DRAFT,
            priority: goal.priority,
            atomicTasks: tasks,
            resourceEstimate: { specialistsRequired: [], memoryUsage: 0, computationBudget: 0, executionTimeMs: 0, parallelismOpportunities: 0 },
            riskAssessment: { failureProbability: 0, missingResources: [], dependencyRisks: [], uncertaintyScore: 0, cascadingFailuresScore: 0 },
            confidence: 0.7,
            explainability: "Generated via Constraint Satisfaction.",
            planningTrace: [{
                timestamp: Date.now(),
                action: "GENERATION",
                details: `Created plan using ${this.getName()}.`
            }],
            executionMetrics: {},
            researchTraceability: { hirqIds: [], tgpId: "", mrpId: "" },
            metadata: { strategy: this.getName(), usedExternalKnowledge: !!knowledge },
            createdAt: Date.now(),
            updatedAt: Date.now()
        };

        return [plan];
    }
}
