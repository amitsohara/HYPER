import { SimulationScenario, SimulationRun, OutcomePrediction, SimulationTrace, SimulationMetric } from "./types.js";
import { v4 as uuidv4 } from "uuid";
import { HILASpecialist } from "../hila1/hilaSpecialist.js";

function cleanJson(str) {
    if (!str) return "{}";
    const match = str.match(/```(?:json)?([\s\S]*?)```/);
    return match ? match[1].trim() : str.trim();
}

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

        let successProb = scenario.parameters.successRate || 0.8;
        let narrative = `Simulated ${scenario.name} completing with ${successProb*100}% probability.`;
        let simulatedRisk = 1.0 - successProb;

        try {
            const hila = HILASpecialist.getInstance();
            if (hila && hila.arbitrator) {
                const request = {
                    id: uuidv4(),
                    missionId: "SYSTEM",
                    domain: "SIMULATION",
                    task: "Simulate scenario",
                    context: { scenario },
                    priority: 5,
                    requiredConfidence: 0.8
                };
                const decision = await hila.arbitrator.arbitrate(request, 0.5);
                
                if (decision.useExternal) {
                    const prompt = `Simulate the following scenario.
Scenario Name: ${scenario.name}
Plan (Intervention): ${JSON.stringify(scenario.interventions?.atomicTasks || [])}
World State:
Entities: ${JSON.stringify(scenario.initialState?.state?.entities || [])}
Relationships: ${JSON.stringify(scenario.initialState?.state?.relationships || [])}

Based on the actual entities (roads, vehicles, signals, pedestrians, obstacles) and their properties, predict the outcome of applying the intervention. Evolve the world state logically.

Return a JSON object with:
- "successProbability": A float from 0 to 1 indicating the likelihood of success.
- "risk": A float from 0 to 1 indicating the likelihood of failure/risk.
- "narrative": A short descriptive text of the simulated outcome, explicitly mentioning the entities involved (e.g. "By optimizing Signal A, Vehicle 101 cleared the intersection...").
Do not use markdown formatting.`;
                    
                    const response = await hila.arbitrator.executeExternal({...request, task: prompt}, decision);
                    if (response && response.content) {
                        let parsed: any = {}; try { parsed = JSON.parse(cleanJson(response.content)); } catch(e) { /* suppress */ }
                        successProb = parsed.successProbability ?? successProb;
                        simulatedRisk = parsed.risk ?? simulatedRisk;
                        narrative = parsed.narrative ?? narrative;
                        trace.steps.push({
                            timestamp: Date.now(),
                            action: "LLM_SIMULATION",
                            stateChanges: { parsed }
                        });
                    }
                } else {
                    let currentTime = 0;
                    while (currentTime < scenario.durationMs) {
                        trace.steps.push({
                            timestamp: currentTime,
                            action: "SIM_STEP",
                            stateChanges: { progress: currentTime / scenario.durationMs }
                        });
                        currentTime += scenario.stepSizeMs;
                    }
                }
            }
        } catch (e) {
            // Suppress error
        }

        const metrics: SimulationMetric = {
            utility: successProb * 100,
            risk: simulatedRisk * 100,
            cost: scenario.durationMs / 1000,
            confidence: 0.85,
            successProbability: successProb
        };

        const outcome: OutcomePrediction = {
            id: uuidv4(),
            scenarioId: scenario.id,
            finalState,
            metrics,
            narrative
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
