import { FaultInjectionPlan, StressTestConfig, MissionScenario } from "../types.js";

export class ScenarioRegistry {
    private scenarios: Map<string, MissionScenario> = new Map();

    register(scenario: MissionScenario) {
        this.scenarios.set(scenario.id, scenario);
    }

    get(id: string): MissionScenario | undefined {
        return this.scenarios.get(id);
    }

    getAll(): MissionScenario[] {
        return Array.from(this.scenarios.values());
    }
}

export class MissionScenarioManager {
    constructor(private registry: ScenarioRegistry) {
        this.loadDefaultScenarios();
    }

    private loadDefaultScenarios() {
        this.registry.register({
            id: "scen-traffic-01",
            name: "Traffic Intelligence",
            domain: "SmartCity",
            description: "End-to-end traffic visual reasoning and optimization.",
            initialWorldState: { trafficDensity: "HIGH" },
            goals: ["Optimize Flow"],
            expectedTrace: ["HPAE", "HWME", "HRE", "HPE", "HSTE", "HDME", "HLLE"],
            allowedLatencyMs: 5000
        });
        
        this.registry.register({
            id: "scen-bike-01",
            name: "Ride Bicycle",
            domain: "Sensorimotor",
            description: "Balance learning and trajectory execution.",
            initialWorldState: { state: "STATIONARY" },
            goals: ["Maintain Balance", "Reach Target"],
            expectedTrace: ["HPAE", "HWME", "HSME", "HDME", "HPAE"],
            allowedLatencyMs: 1000
        });
        
        // Mock remaining scenarios...
    }
}

export class FaultInjectionEngine {
    inject(plan: FaultInjectionPlan) {
        console.log(`Injecting faults for scenario: ${plan.scenarioId}`);
        // Mock injection into HCNS or subsystems
    }
}

export class StressTestEngine {
    async run(config: StressTestConfig): Promise<any> {
        console.log(`Running stress test: ${config.concurrentMissions} concurrent missions.`);
        // Mock stress execution
        return {
            throughput: 5000, // events per sec
            meanLatencyMs: 150,
            successRate: 0.99
        };
    }
}
