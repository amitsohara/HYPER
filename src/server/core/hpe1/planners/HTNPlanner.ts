import { IPlanningStrategy } from "../IPlanningStrategy.js";
import { PlanObject, GoalObject, PlanStatus, AtomicTask, TaskStatus } from "../types.js";
import { v4 as uuidv4 } from "uuid";

interface HTNRecipe {
    match: (goal: string) => boolean;
    steps: { name: (goal: string, knowledge: string) => string, desc: (goal: string, knowledge: string) => string }[];
}

const HTN_LIBRARY: HTNRecipe[] = [
    {
        match: (goal: string) => goal.toLowerCase().includes("traffic") || goal.toLowerCase().includes("congestion"),
        steps: [
            { name: () => "Analyze traffic density", desc: () => "Collect sensor data to determine congestion levels." },
            { name: () => "Optimize signal timing", desc: (goal, knowledge) => `Adjust signal phases using ${knowledge ? 'retrieved facts: ' + knowledge : 'standard heuristics'}.` },
            { name: () => "Monitor intersection", desc: () => "Verify if traffic flow improves." }
        ]
    },
    {
        match: (goal: string) => goal.toLowerCase().includes("accident") || goal.toLowerCase().includes("emergency"),
        steps: [
            { name: () => "Detect Severity", desc: () => "Assess accident severity and lane blockage." },
            { name: () => "Reroute Traffic", desc: () => "Divert traffic using variable message signs." },
            { name: () => "Dispatch Response", desc: () => "Notify emergency services." }
        ]
    },
    {
        // This is only triggered if knowledge was provided (fallback capability)
        match: (goal: string) => true,
        steps: [
            { name: (goal) => `Analyze context for ${goal}`, desc: () => "Assess the current state related to the goal." },
            { name: (goal) => `Formulate intervention for ${goal}`, desc: (goal, knowledge) => `Create an action plan leveraging: ${knowledge || 'internal rules'}` },
            { name: (goal) => `Execute and verify`, desc: () => "Apply the intervention and verify success." }
        ]
    }
];

export class HTNPlanner implements IPlanningStrategy {
    getName(): string {
        return "HTN_PLANNER";
    }

    async generatePlans(goal: GoalObject, context: any): Promise<PlanObject[]> {
        const knowledge = context.retrievedKnowledge || "";
        
        let recipe = HTN_LIBRARY.find(r => r.match(goal.name));
        
        // If we found the fallback recipe AND we don't have knowledge, fail this planner so the orchestrator can fetch knowledge
        if (recipe === HTN_LIBRARY[HTN_LIBRARY.length - 1] && !knowledge) {
            return [];
        }

        const tasks: Record<string, AtomicTask> = {};
        let prevId: null | string = null;
        
        const steps = recipe?.steps || HTN_LIBRARY[HTN_LIBRARY.length - 1].steps;

        for (let i = 0; i < steps.length; i++) {
            const step = steps[i];
            const taskId = uuidv4();
            const task: AtomicTask = {
                id: taskId,
                name: step.name(goal.name, knowledge),
                description: step.desc(goal.name, knowledge),
                status: TaskStatus.PENDING,
                dependencies: prevId ? [prevId] : [],
                preconditions: [],
                postconditions: [`Step ${i + 1} completed`],
                requiredSpecialists: [],
                estimatedDurationMs: 1000,
                metrics: {}
            };
            tasks[taskId] = task;
            prevId = taskId;
        }

        const plan: PlanObject = {
            id: uuidv4(),
            goalId: goal.id,
            version: 1,
            status: PlanStatus.DRAFT,
            priority: goal.priority,
            atomicTasks: tasks,
            resourceEstimate: { specialistsRequired: [], memoryUsage: 0, computationBudget: 0, executionTimeMs: 0, parallelismOpportunities: 0 },
            riskAssessment: { failureProbability: 0, missingResources: [], dependencyRisks: [], uncertaintyScore: 0, cascadingFailuresScore: 0 },
            confidence: knowledge ? 0.6 : 0.8,
            explainability: "Generated via Hierarchical Task Network (HTN) recipe.",
            planningTrace: [{
                timestamp: Date.now(),
                action: "GENERATION",
                details: `Decomposed goal into ${steps.length} atomic tasks using HTN strategy.`
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
