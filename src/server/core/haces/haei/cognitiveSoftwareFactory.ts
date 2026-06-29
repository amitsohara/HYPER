import { EngineeringPlanner } from "./engineeringPlanner.js";
import { ProductionCodeGenerator } from "./productionCodeGenerator.js";
import { EngineeringDigitalTwin } from "./engineeringDigitalTwin.js";
import { HCAIEngineeringPackage, EngineeringPlan, CodeArtifact } from "./engineeringTypes.js";

export class CognitiveSoftwareFactory {
    private planner: EngineeringPlanner;
    private codeGenerator: ProductionCodeGenerator;
    private twin: EngineeringDigitalTwin;

    constructor(planner: EngineeringPlanner, codeGenerator: ProductionCodeGenerator, twin: EngineeringDigitalTwin) {
        this.planner = planner;
        this.codeGenerator = codeGenerator;
        this.twin = twin;
    }

    public executeSprint(pkg: HCAIEngineeringPackage): { plan: EngineeringPlan, artifacts: CodeArtifact[] } {
        // 1. Planning
        const plan = this.planner.createPlan(pkg);
        this.twin.updatePlan(plan);

        // 2. Implementation
        const allArtifacts: CodeArtifact[] = [];
        let completedTasks = 0;

        for (const task of plan.tasks) {
            const artifacts = this.codeGenerator.generateCode(task);
            allArtifacts.push(...artifacts);
            completedTasks++;
            this.twin.updateProgress(plan.plan_id, (completedTasks / plan.tasks.length) * 100);
        }

        this.twin.updateCodeMetrics(allArtifacts);

        return { plan, artifacts: allArtifacts };
    }
}
