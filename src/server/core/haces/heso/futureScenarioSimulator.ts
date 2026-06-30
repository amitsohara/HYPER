import { v4 as uuidv4 } from "uuid";
import { GoogleGenAI } from "@google/genai";
import { FutureScenario } from "./strategyTypes.js";
import { StrategyEventBus, StrategyEvents } from "./strategyEvents.js";
import { StrategyMetrics } from "./strategyMetrics.js";
import { generateWithRetry, cleanJSON } from "../../../engines.js";

/**
 * @class FutureScenarioSimulator
 * @description Simulates multiple strategic evolution trajectories for HyperMind 
 * by grounding projections in historical evidence and institutional knowledge (HEM).
 * Supports HRDD production standards including strong typing, error handling, telemetry, and validation.
 */
export class FutureScenarioSimulator {
    private eventBus = StrategyEventBus.getInstance();
    private readonly version = "1.0.0"; // Semantic Versioning

    /**
     * Simulates future scenarios based on current state and historical evidence.
     * @param ai GoogleGenAI client
     * @param currentState The current strategic state context
     * @param hem HyperMind Evolution Memory instance (optional for backward compatibility, but required for deep grounding)
     * @returns Array of FutureScenario objects
     */
    public async simulateScenarios(ai: GoogleGenAI, currentState: any, hem?: any): Promise<FutureScenario[]> {
        const startTime = Date.now();
        console.log(`[HESO] [v${this.version}] FutureScenarioSimulator: Initiating scenario simulation...`);

        try {
            // 1. Gather Historical Evidence from HEM
            let historicalContext = "No historical evidence provided.";
            if (hem && hem.ikb) {
                const lessons = hem.ikb.getAllLessons() || [];
                const artifacts = hem.ikb.getAllArtifacts() || [];
                historicalContext = `
                Historical Lessons (${lessons.length}): ${JSON.stringify(lessons.slice(0, 5))}
                Evolution Artifacts (${artifacts.length}): ${JSON.stringify(artifacts.slice(0, 5))}
                `;
            }

            // 2. Formulate Prompt
            const prompt = `Simulate future evolution scenarios for HyperMind based on the current state and historical evidence.
Current State: ${JSON.stringify(currentState)}
Historical Evidence: ${historicalContext}

Generate 3 distinct strategic scenarios:
1. Conservative Evolution (low risk, incremental capability growth)
2. Aggressive Evolution (high risk, rapid capability expansion)
3. Research-Focused Evolution (medium risk, deep theoretical discovery)

Return JSON in the following format exactly:
{
  "scenarios": [
    {
      "name": "Scenario Name",
      "description": "Detailed description of the trajectory.",
      "assumptions": ["Assumption 1", "Assumption 2"],
      "projected_outcomes": ["Outcome 1", "Outcome 2"],
      "probability": 0.5,
      "projected_intelligence_gains": 80,
      "risk_level": 30,
      "resource_consumption": 50
    }
  ]
}`;

            // 3. Execution
            let scenarios: any[] = [];
            const res = await generateWithRetry(ai, {
                model: "gemini-2.5-flash",
                contents: prompt,
                config: { responseMimeType: "application/json" }
            });

            // 4. Validation & Parsing
            const parsed = await cleanJSON(res?.text || "{}", ai);
            
            if (!parsed || !Array.isArray(parsed.scenarios)) {
                throw new Error("Invalid response format: 'scenarios' array missing from generation.");
            }
            
            scenarios = parsed.scenarios;

            // 5. Normalization & Ranking
            let mapped: FutureScenario[] = scenarios.map((s: any) => ({
                scenario_id: uuidv4(),
                name: String(s.name || "Unknown Scenario"),
                description: String(s.description || "No description provided."),
                assumptions: Array.isArray(s.assumptions) ? s.assumptions.map(String) : [],
                projected_outcomes: Array.isArray(s.projected_outcomes) ? s.projected_outcomes.map(String) : [],
                probability: typeof s.probability === "number" ? s.probability : 0.5,
                projected_intelligence_gains: typeof s.projected_intelligence_gains === "number" ? s.projected_intelligence_gains : 0,
                risk_level: typeof s.risk_level === "number" ? s.risk_level : 0,
                resource_consumption: typeof s.resource_consumption === "number" ? s.resource_consumption : 0,
                rank: 0,
                timestamp: Date.now()
            }));

            // Rank scenarios: simple heuristic (gains * probability) / (risk + consumption + 1)
            mapped.sort((a, b) => {
                const scoreA = (a.projected_intelligence_gains * a.probability) / (a.risk_level + a.resource_consumption + 1);
                const scoreB = (b.projected_intelligence_gains * b.probability) / (b.risk_level + b.resource_consumption + 1);
                return scoreB - scoreA;
            });

            // Assign rank
            mapped.forEach((s, index) => {
                s.rank = index + 1;
            });

            // 6. Telemetry & Events
            const duration = Date.now() - startTime;
            StrategyMetrics.scenarios_simulated += mapped.length;
            this.eventBus.publish(StrategyEvents.FUTURE_SCENARIO_GENERATED, { 
                count: mapped.length, 
                duration_ms: duration,
                version: this.version
            });

            console.log(`[HESO] FutureScenarioSimulator: Successfully simulated ${mapped.length} scenarios in ${duration}ms.`);
            return mapped;

        } catch (e: any) {
            console.error(`[HESO] FutureScenarioSimulator Error: ${e.message}`, e);
            // Fallback strategy in case of failure to ensure pipeline doesn't break
            this.eventBus.publish(StrategyEvents.FUTURE_SCENARIO_GENERATED, { error: e.message });
            return [this.getFallbackScenario()];
        }
    }

    private getFallbackScenario(): FutureScenario {
        return {
            scenario_id: uuidv4(),
            name: "Baseline Continuation (Fallback)",
            description: "System failed to simulate complex scenarios. Defaulting to safe, linear continuation of current capabilities.",
            assumptions: ["System stability is paramount", "Generative failure occurred"],
            projected_outcomes: ["Maintain current capability level"],
            probability: 1.0,
            projected_intelligence_gains: 0,
            risk_level: 0,
            resource_consumption: 0,
            rank: 1,
            timestamp: Date.now()
        };
    }
}
