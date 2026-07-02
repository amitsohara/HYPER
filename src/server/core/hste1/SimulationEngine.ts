import { SimulationScenario, SimulationRun, OutcomePrediction, SimulationTrace, SimulationMetric } from "./types.js";
import { v4 as uuidv4 } from "uuid";

export class SimulationEngine {
    async runSimulation(scenario: SimulationScenario): Promise<SimulationRun> {
        const runId = uuidv4();
        const trace: SimulationTrace = {
            id: uuidv4(),
            simulationId: runId,
            steps: [],
            metadata: {}
        };

        const finalState = JSON.parse(JSON.stringify(scenario.initialState));

        // Simulate steps
        let currentTime = 0;
        let successProb = scenario.parameters.successRate || 0.8;
        
        while (currentTime < scenario.durationMs) {
            trace.steps.push({
                timestamp: currentTime,
                action: "SIM_STEP",
                stateChanges: { progress: currentTime / scenario.durationMs }
            });
            currentTime += scenario.stepSizeMs;
        }

        const risk = 1.0 - successProb;
        const metrics: SimulationMetric = {
            utility: successProb * 100,
            risk: risk * 100,
            cost: scenario.durationMs / 1000,
            confidence: 0.85,
            successProbability: successProb
        };

        const outcome: OutcomePrediction = {
            id: uuidv4(),
            scenarioId: scenario.id,
            finalState,
            metrics,
            narrative: `Simulated ${scenario.name} completing with ${successProb*100}% probability.`
        };

        return {
            id: runId,
            scenarioId: scenario.id,
            status: "COMPLETED",
            startTime: Date.now() - scenario.durationMs,
            endTime: Date.now(),
            outcome,
            trace
        };
    }
}
