import { GoalObject, AtomicTask, TaskStatus } from "../types.js";
import { v4 as uuidv4 } from "uuid";

export class GoalDecompositionEngine {
    
    decompose(highLevelGoal: GoalObject): Map<string, AtomicTask> {
        const tasks = new Map<string, AtomicTask>();
        
        // Simplified decomposition: break a goal into 3 atomic tasks sequentially
        for (let i = 1; i <= 3; i++) {
            const taskId = uuidv4();
            const task: AtomicTask = {
                id: taskId,
                name: `${highLevelGoal.name} - Step ${i}`,
                description: `Automatically decomposed step ${i} for goal: ${highLevelGoal.description}`,
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
