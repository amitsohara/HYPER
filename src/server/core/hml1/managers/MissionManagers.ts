import { MissionScenarioDefinition } from "../types.js";

export class MissionScenarioRegistry {
    private scenarios: Map<string, MissionScenarioDefinition> = new Map();

    register(scenario: MissionScenarioDefinition) {
        this.scenarios.set(scenario.id, scenario);
    }

    getAll(): MissionScenarioDefinition[] {
        return Array.from(this.scenarios.values());
    }
}

export class BenchmarkScenarioGenerator {
    constructor(private registry: MissionScenarioRegistry) {
        this.loadGrandChallenge();
    }

    private loadGrandChallenge() {
        this.registry.register({
            id: "gc-traffic-01",
            name: "Traffic Optimization",
            domain: "SmartCity",
            description: "Optimize flow for 4-way intersection.",
            inputs: [],
            expectedOutcomes: [],
            constraints: {}
        });

        this.registry.register({
            id: "gc-medicine-01",
            name: "Medicine Verification",
            domain: "Healthcare",
            description: "Verify medicine packing from video stream.",
            inputs: [],
            expectedOutcomes: [],
            constraints: {}
        });

        this.registry.register({
            id: "gc-robot-01",
            name: "Robot Pick & Place",
            domain: "Robotics",
            description: "Pick object A and place in bin B.",
            inputs: [],
            expectedOutcomes: [],
            constraints: {}
        });
    }
}
