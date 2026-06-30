import { v4 as uuidv4 } from "uuid";
import { GoogleGenAI } from "@google/genai";
import { FutureScenario } from "./strategyTypes.js";
import { StrategyEventBus, StrategyEvents } from "./strategyEvents.js";
import { StrategyMetrics } from "./strategyMetrics.js";
import { generateWithRetry, cleanJSON } from "../../../engines.js";

export class FutureScenarioSimulator {
    private eventBus = StrategyEventBus.getInstance();

    public async simulateScenarios(ai: GoogleGenAI, currentState: any): Promise<FutureScenario[]> {
        const prompt = `Simulate future evolution scenarios based on current state.
State: ${JSON.stringify(currentState)}

Generate 3 scenarios: Conservative, Aggressive, and Research-Focused.

Return JSON:
{
  "scenarios": [
    {
      "name": "Conservative Evolution",
      "description": "...",
      "assumptions": ["..."],
      "projected_outcomes": ["..."],
      "probability": 0.6
    }
  ]
}`;
        let scenarios: any[] = [];
        try {
            const res = await generateWithRetry(ai, {
                model: "gemini-2.5-flash",
                contents: prompt,
                config: { responseMimeType: "application/json" }
            });
            const parsed = await cleanJSON(res?.text || "{}", ai);
            scenarios = parsed.scenarios || [];
        } catch (e) {
            console.error("FutureScenarioSimulator failed:", e);
        }

        const mapped: FutureScenario[] = scenarios.map(s => ({
            scenario_id: uuidv4(),
            name: s.name,
            description: s.description,
            assumptions: s.assumptions || [],
            projected_outcomes: s.projected_outcomes || [],
            probability: s.probability || 0.5,
            timestamp: Date.now()
        }));

        StrategyMetrics.scenarios_simulated += mapped.length;
        this.eventBus.publish(StrategyEvents.FUTURE_SCENARIO_GENERATED, { count: mapped.length });

        return mapped;
    }
}
