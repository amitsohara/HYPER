const fs = require('fs');

let path = 'src/server/core/hpe1/engines/goalDecompositionEngine.ts';

const code = `import { GoalObject, AtomicTask, TaskStatus } from "../types.js";
import { v4 as uuidv4 } from "uuid";
import { HILASpecialist } from "../../hila1/hilaSpecialist.js";

interface HTNRecipe {
    match: (goal: string) => boolean;
    steps: { name: (goal: string, knowledge: string) => string, desc: (goal: string, knowledge: string) => string }[];
}

const HTN_LIBRARY: HTNRecipe[] = [
    {
        match: (goal: string) => goal.toLowerCase().includes("traffic") || goal.toLowerCase().includes("congestion"),
        steps: [
            { name: () => "Analyze traffic density", desc: () => "Collect sensor data to determine congestion levels." },
            { name: () => "Optimize signal timing", desc: (goal, knowledge) => \`Adjust signal phases using \${knowledge ? 'retrieved facts: ' + knowledge : 'standard heuristics'}.\` },
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
        match: (goal: string) => true, // Fallback
        steps: [
            { name: (goal) => \`Analyze context for \${goal}\`, desc: () => "Assess the current state related to the goal." },
            { name: (goal) => \`Formulate intervention for \${goal}\`, desc: (goal, knowledge) => \`Create an action plan leveraging: \${knowledge || 'internal rules'}\` },
            { name: (goal) => \`Execute and verify\`, desc: () => "Apply the intervention and verify success." }
        ]
    }
];

export class GoalDecompositionEngine {
    private cache: Map<string, Record<string, AtomicTask>> = new Map();
    private activeRequests: Map<string, Promise<Record<string, AtomicTask>>> = new Map();

    async decompose(highLevelGoal: GoalObject): Promise<Record<string, AtomicTask>> {
        const cacheKey = highLevelGoal.name + highLevelGoal.description;
        if (this.cache.has(cacheKey)) return this.cache.get(cacheKey)!;
        if (this.activeRequests.has(cacheKey)) return await this.activeRequests.get(cacheKey)!;

        const req = this.doDecompose(highLevelGoal).then(res => {
            this.cache.set(cacheKey, res);
            this.activeRequests.delete(cacheKey);
            return res;
        });
        this.activeRequests.set(cacheKey, req);
        return req;
    }

    private async doDecompose(highLevelGoal: GoalObject): Promise<Record<string, AtomicTask>> {
        let recipe = HTN_LIBRARY.find(r => r.match(highLevelGoal.name));
        let knowledge = "";

        // If it's the fallback recipe, we genuinely lack specific knowledge.
        if (recipe === HTN_LIBRARY[HTN_LIBRARY.length - 1]) {
            try {
                const hila = HILASpecialist.getInstance();
                if (hila && hila.arbitrator) {
                    const request = {
                        id: uuidv4(),
                        missionId: "SYSTEM",
                        domain: "RESEARCH",
                        task: \`Retrieve facts and examples for achieving goal: \${highLevelGoal.name}\`,
                        context: { goal: highLevelGoal },
                        priority: 5,
                        requiredConfidence: 0.8
                    };
                    const arbitration = await hila.arbitrator.arbitrate(request, 0.3); // Low internal confidence
                    if (arbitration.useExternal) {
                        const response = await hila.arbitrator.executeExternal(request, arbitration);
                        if (response && response.content) {
                            // Extract just some brief facts from the response to simulate knowledge retrieval
                            knowledge = response.content;
                        }
                    }
                }
            } catch (e) {
                console.error("Failed to retrieve external knowledge via HILA:", e);
            }
        }

        const tasks: Record<string, AtomicTask> = {};
        let prevId: null | string = null;
        
        const steps = recipe?.steps || HTN_LIBRARY[HTN_LIBRARY.length - 1].steps;

        for (let i = 0; i < steps.length; i++) {
            const step = steps[i];
            const taskId = uuidv4();
            const task: AtomicTask = {
                id: taskId,
                name: step.name(highLevelGoal.name, knowledge),
                description: step.desc(highLevelGoal.name, knowledge),
                status: TaskStatus.PENDING,
                dependencies: prevId ? [prevId] : [],
                preconditions: [],
                postconditions: [\`Step \${i + 1} completed\`],
                requiredSpecialists: [],
                estimatedDurationMs: 1000,
                metrics: {}
            };
            tasks[taskId] = task;
            prevId = taskId;
        }

        return tasks;
    }
}
`;

fs.writeFileSync(path, code);
console.log("Refactored GoalDecompositionEngine");
