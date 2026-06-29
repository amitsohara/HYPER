import { EngineeringPlan, HCAIEngineeringPackage, EngineeringTask } from "./engineeringTypes.js";
import { EngineeringEventBus, EngineeringEvents } from "./engineeringEvents.js";
import { TaskDecomposer } from "./taskDecomposer.js";

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export class EngineeringPlanner {
    private eventBus = EngineeringEventBus.getInstance();
    private taskDecomposer: TaskDecomposer;

    constructor(taskDecomposer: TaskDecomposer) {
        this.taskDecomposer = taskDecomposer;
    }

    public createPlan(pkg: HCAIEngineeringPackage): EngineeringPlan {
        const tasks = this.taskDecomposer.decompose(pkg);

        const plan: EngineeringPlan = {
            plan_id: uuidv4(),
            package_id: pkg.package_id,
            work_breakdown_structure: "1. Planning 2. Implementation 3. Testing 4. Release",
            tasks,
            milestones: ["Sprint 1: Core", "Sprint 2: Security & Perf", "Sprint 3: Docs & Build"],
            delivery_roadmap: ["Week 1", "Week 2"],
            rollback_strategy: pkg.rollback_procedures[0] || "Standard rollback",
            timestamp: Date.now()
        };

        this.eventBus.publish(EngineeringEvents.ENGINEERING_PLAN_CREATED, { plan });
        return plan;
    }
}
