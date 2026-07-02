import { SimulationScenario, ScenarioCategory, WorldTwin } from "./types.js";
import { v4 as uuidv4 } from "uuid";

export class ScenarioGenerator {
    generateScenarios(baseTwin: WorldTwin, plan: any): SimulationScenario[] {
        const scenarios: SimulationScenario[] = [];

        // Best Case Scenario
        scenarios.push({
            id: uuidv4(),
            name: `Best Case - ${plan.id || "Plan"}`,
            category: ScenarioCategory.BEST_CASE,
            initialState: JSON.parse(JSON.stringify(baseTwin)),
            interventions: { ...plan, optimistic: true },
            parameters: { riskMultiplier: 0.5, successRate: 1.0 },
            durationMs: 10000,
            stepSizeMs: 1000
        });

        // Worst Case Scenario
        scenarios.push({
            id: uuidv4(),
            name: `Worst Case - ${plan.id || "Plan"}`,
            category: ScenarioCategory.WORST_CASE,
            initialState: JSON.parse(JSON.stringify(baseTwin)),
            interventions: { ...plan, pessimistic: true },
            parameters: { riskMultiplier: 2.0, successRate: 0.4 },
            durationMs: 10000,
            stepSizeMs: 1000
        });

        // Average Case
        scenarios.push({
            id: uuidv4(),
            name: `Average Case - ${plan.id || "Plan"}`,
            category: ScenarioCategory.AVERAGE_CASE,
            initialState: JSON.parse(JSON.stringify(baseTwin)),
            interventions: { ...plan },
            parameters: { riskMultiplier: 1.0, successRate: 0.8 },
            durationMs: 10000,
            stepSizeMs: 1000
        });

        return scenarios;
    }
}
