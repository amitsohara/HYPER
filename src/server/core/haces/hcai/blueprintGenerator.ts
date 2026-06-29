import { CognitiveBlueprint, BlueprintStatus } from "./architectureTypes.js";
import { ArchitectureEventBus, ArchitectureEvents } from "./architectureEvents.js";

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export class BlueprintGenerator {
    private blueprints: Map<string, CognitiveBlueprint> = new Map();
    private eventBus = ArchitectureEventBus.getInstance();

    public generateBlueprint(mission: string, objective: string): CognitiveBlueprint {
        const blueprint: CognitiveBlueprint = {
            blueprint_id: uuidv4(),
            version: "1.0.0",
            mission,
            functional_objectives: [objective],
            cognitive_responsibilities: ["Execute reasoning", "Update memory"],
            inputs: ["Sensory data", "Mission params"],
            outputs: ["Action Plan"],
            internal_reasoning_workflow: "Sequential planning",
            data_flow: "Input -> Memory -> Planner -> Output",
            decision_flow: "Heuristic search",
            control_flow: "Hierarchical",
            state_transitions: ["IDLE -> THINKING -> EXECUTING"],
            dependencies: [],
            external_interfaces: [],
            internal_interfaces: [],
            performance_expectations: { latency: "< 500ms" },
            scalability_strategy: "Horizontal scaling of workers",
            safety_constraints: ["No unauthorized external requests"],
            rollback_strategy: "Revert to previous pipeline version",
            evolution_path: "Extensible to multi-agent planning",
            status: BlueprintStatus.DRAFT,
            timestamp: Date.now()
        };

        this.blueprints.set(blueprint.blueprint_id, blueprint);
        this.eventBus.publish(ArchitectureEvents.BLUEPRINT_CREATED, { blueprint });
        return blueprint;
    }

    public updateBlueprintStatus(id: string, status: BlueprintStatus) {
        const bp = this.blueprints.get(id);
        if (bp) {
            bp.status = status;
            if (status === BlueprintStatus.APPROVED) {
                this.eventBus.publish(ArchitectureEvents.BLUEPRINT_APPROVED, { blueprint: bp });
            } else if (status === BlueprintStatus.REJECTED) {
                this.eventBus.publish(ArchitectureEvents.BLUEPRINT_REJECTED, { blueprint: bp });
            }
        }
    }

    public getBlueprint(id: string): CognitiveBlueprint | undefined {
        return this.blueprints.get(id);
    }

    public getAllBlueprints(): CognitiveBlueprint[] {
        return Array.from(this.blueprints.values());
    }
}
