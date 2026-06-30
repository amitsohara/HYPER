import { v4 as uuidv4 } from "uuid";
import { GoogleGenAI } from "@google/genai";
import { CivilizationForecast } from "./strategyTypes.js";
import { StrategyEventBus, StrategyEvents } from "./strategyEvents.js";
import { generateWithRetry, cleanJSON } from "../../../engines.js";

export class CivilizationPlanner {
    private eventBus = StrategyEventBus.getInstance();

    public async forecastCivilization(ai: GoogleGenAI, decades: number, currentState: any): Promise<CivilizationForecast> {
        const prompt = `Model the HyperMind ecosystem over the next ${decades} decades.
Current State: ${JSON.stringify(currentState)}

Return JSON:
{
  "capability_growth_projection": 500,
  "infrastructure_requirements": "Massive distributed simulation grid",
  "human_collaboration_model": "Symbiotic co-evolution",
  "sustainability_rating": 85
}`;
        let result: any = {
            capability_growth_projection: 100,
            infrastructure_requirements: "Unknown",
            human_collaboration_model: "Unknown",
            sustainability_rating: 50
        };

        try {
            const res = await generateWithRetry(ai, {
                model: "gemini-2.5-flash",
                contents: prompt,
                config: { responseMimeType: "application/json" }
            });
            result = await cleanJSON(res?.text || "{}", ai);
        } catch (e) {
            console.error("CivilizationPlanner failed:", e);
        }

        const forecast: CivilizationForecast = {
            forecast_id: uuidv4(),
            timestamp: Date.now(),
            decades_ahead: decades,
            capability_growth_projection: result.capability_growth_projection || 0,
            infrastructure_requirements: result.infrastructure_requirements || "",
            human_collaboration_model: result.human_collaboration_model || "",
            sustainability_rating: result.sustainability_rating || 0
        };

        this.eventBus.publish(StrategyEvents.CIVILIZATION_FORECAST_UPDATED, forecast);

        return forecast;
    }
}
