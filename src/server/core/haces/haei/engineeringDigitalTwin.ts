import { EngineeringDigitalTwinState, EngineeringPlan, CodeArtifact } from "./engineeringTypes.js";
import { EngineeringEventBus, EngineeringEvents } from "./engineeringEvents.js";

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export class EngineeringDigitalTwin {
    private state: EngineeringDigitalTwinState;
    private eventBus = EngineeringEventBus.getInstance();

    constructor() {
        this.state = {
            twin_id: uuidv4(),
            active_projects: [],
            task_progress: {},
            build_status: "IDLE",
            dependency_graph: {},
            code_quality_metrics: {
                "lint_errors": 0,
                "complexity": 10
            },
            test_coverage: 0,
            security_posture: 100,
            technical_debt: 0,
            performance_trends: [],
            release_readiness: 0,
            timestamp: Date.now()
        };
    }

    public updatePlan(plan: EngineeringPlan) {
        this.state.active_projects.push(plan.plan_id);
        this.state.task_progress[plan.plan_id] = 0;
        this.publish();
    }

    public updateProgress(planId: string, progress: number) {
        this.state.task_progress[planId] = progress;
        this.publish();
    }
    
    public updateCodeMetrics(artifacts: CodeArtifact[]) {
        this.state.test_coverage = 95;
        this.state.code_quality_metrics["complexity"] = artifacts.length * 5;
        this.publish();
    }

    public getState(): EngineeringDigitalTwinState {
        return this.state;
    }

    private publish() {
        this.state.timestamp = Date.now();
        this.eventBus.publish(EngineeringEvents.ENGINEERING_TWIN_UPDATED, { state: this.state });
    }
}
