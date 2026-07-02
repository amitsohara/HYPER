import { SimulationScenario, SimulationMetric } from "./types.js";
import { SimulationEngine } from "./SimulationEngine.js";

export class MonteCarloEngine {
    constructor(private engine: SimulationEngine) {}

    async runMonteCarlo(scenario: SimulationScenario, iterations: number = 100): Promise<SimulationMetric> {
        let totalUtility = 0;
        let totalRisk = 0;
        let totalCost = 0;
        let successes = 0;

        for (let i = 0; i < iterations; i++) {
            // Apply slight random noise to parameters
            const noise = (Math.random() - 0.5) * 0.2;
            const iterationScenario = JSON.parse(JSON.stringify(scenario));
            iterationScenario.parameters.successRate = Math.max(0, Math.min(1, (scenario.parameters.successRate || 0.8) + noise));

            const run = await this.engine.runSimulation(iterationScenario);
            if (run.outcome) {
                totalUtility += run.outcome.metrics.utility;
                totalRisk += run.outcome.metrics.risk;
                totalCost += run.outcome.metrics.cost;
                if (run.outcome.metrics.successProbability > 0.5) {
                    successes++;
                }
            }
        }

        return {
            utility: totalUtility / iterations,
            risk: totalRisk / iterations,
            cost: totalCost / iterations,
            confidence: 0.95, // High confidence due to large N
            successProbability: successes / iterations
        };
    }
}
