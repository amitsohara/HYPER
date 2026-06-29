import { EngineeringTask, HCAIEngineeringPackage, TaskStatus, EngineeringTeam } from "./engineeringTypes.js";
import { EngineeringEventBus, EngineeringEvents } from "./engineeringEvents.js";

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export class TaskDecomposer {
    private eventBus = EngineeringEventBus.getInstance();

    public decompose(pkg: HCAIEngineeringPackage): EngineeringTask[] {
        const tasks: EngineeringTask[] = [];

        const teams = [
            EngineeringTeam.BACKEND,
            EngineeringTeam.FRONTEND,
            EngineeringTeam.SECURITY,
            EngineeringTeam.PERFORMANCE,
            EngineeringTeam.DOCUMENTATION,
            EngineeringTeam.PACKAGING
        ];

        teams.forEach((team, index) => {
            const task: EngineeringTask = {
                task_id: uuidv4(),
                team,
                objective: `Implement ${team} components for ${pkg.package_id}`,
                dependencies: index > 0 ? [tasks[0].task_id] : [],
                priority: 10,
                estimated_effort: 20,
                acceptance_criteria: ["Passes unit tests", "Adheres to clean architecture"],
                completion_definition: "Code committed and reviewed",
                status: TaskStatus.PENDING
            };
            tasks.push(task);
            this.eventBus.publish(EngineeringEvents.TASK_GENERATED, { task });
        });

        return tasks;
    }
}
