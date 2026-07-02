import { SimulationScenario, ScenarioCategory, WorldTwin } from "./types.js";
import { v4 as uuidv4 } from "uuid";
import { SimulationEngine } from "./SimulationEngine.js";

export class CounterfactualSimulationEngine {
    constructor(private engine: SimulationEngine) {}

    async runCounterfactual(baseTwin: WorldTwin, intervention: Record<string, any>): Promise<any> {
        const scenario: SimulationScenario = {
            id: uuidv4(),
            name: `Counterfactual: ${JSON.stringify(intervention)}`,
            category: ScenarioCategory.COUNTERFACTUAL,
            initialState: JSON.parse(JSON.stringify(baseTwin)), // Isolated twin
            interventions: intervention,
            parameters: { successRate: 0.8 }, // Base assumption
            durationMs: 5000,
            stepSizeMs: 500
        };

        const run = await this.engine.runSimulation(scenario);
        return run;
    }
}
