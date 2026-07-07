import { GoalObject, AtomicTask, TaskStatus } from "../types.js";
import { v4 as uuidv4 } from "uuid";
import { HILASpecialist } from "../../hila1/hilaSpecialist.js";

export class GoalDecompositionEngine {
    
    async decompose(highLevelGoal: GoalObject): Promise<Map<string, AtomicTask>> {
        const tasks = new Map<string, AtomicTask>();
        
        try {
            const hila = HILASpecialist.getInstance();
            if (hila && hila.arbitrator) {
                const request = {
                    id: uuidv4(),
                    missionId: "SYSTEM",
                    domain: "PLANNING",
                    task: "Decompose goal into atomic tasks.",
                    context: { goal: highLevelGoal },
                    priority: highLevelGoal.priority || 5,
                    requiredConfidence: 0.8
                };
                
                const decision = await hila.arbitrator.arbitrate(request, 0.4); // low internal confidence
                if (decision.useExternal) {
                    const prompt = `Decompose the following goal into exactly 3-5 sequential atomic tasks. 
Goal Name: ${highLevelGoal.name}
Goal Description: ${highLevelGoal.description}

Output as JSON array with properties: "name", "description". No markdown wrapping.`;
                    
                    const response = await hila.arbitrator.executeExternal({...request, task: prompt}, decision);
                    if (response && response.content) {
                        let parsed: any = {}; try { parsed = (function(){ try { return JSON.parse(response.content); } catch(e) { return [] as any; } })(); } catch(e) { console.warn("Failed to parse LLM response", response.content); }
                        let prevId = null;
                        for (let i = 0; i < parsed.length; i++) {
                            const step = parsed[i];
                            const taskId = uuidv4();
                            const task: AtomicTask = {
                                id: taskId,
                                name: step.name || `${highLevelGoal.name} - Step ${i + 1}`,
                                description: step.description || `Generated step ${i + 1} for goal`,
                                status: TaskStatus.PENDING,
                                dependencies: prevId ? [prevId] : [],
                                preconditions: [],
                                postconditions: [`Step ${i + 1} completed`],
                                requiredSpecialists: [],
                                estimatedDurationMs: 1000,
                                metrics: {}
                            };
                            tasks.set(taskId, task);
                            prevId = taskId;
                        }
                        return tasks;
                    }
                }
            }
        } catch (e) {
            console.error("Failed to decompose goal with HILA:", e);
        }
        
        return this.fallbackDecompose(highLevelGoal);
    }

    private fallbackDecompose(highLevelGoal: GoalObject): Map<string, AtomicTask> {
        const tasks = new Map<string, AtomicTask>();
        // Simplified decomposition: break a goal into 3 atomic tasks sequentially
        for (let i = 1; i <= 3; i++) {
            const taskId = uuidv4();
            const task: AtomicTask = {
                id: taskId,
                name: `${highLevelGoal.name} - Step ${i}`,
                description: `Heuristically decomposed step ${i} for goal: ${highLevelGoal.description}`,
                status: TaskStatus.PENDING,
                dependencies: i > 1 ? [Array.from(tasks.keys())[i - 2]] : [],
                preconditions: [],
                postconditions: [`Step ${i} completed`],
                requiredSpecialists: [],
                estimatedDurationMs: 1000,
                metrics: {}
            };
            tasks.set(taskId, task);
        }
        
        return tasks;
    }
}
