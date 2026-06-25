import { GoogleGenAI } from '@google/genai';
import { generateWithRetry, cleanJSON } from '../engines.js';

export class WorldModelEngine {
    static async simulateFuture(ai: GoogleGenAI, config: { domain: string, startYear: number, endYear: number, context: string }) {
        const prompt = `You are a Future World Simulator predicting from ${config.startYear} to ${config.endYear} in the domain of ${config.domain}.
Context: ${config.context}
Generate a simulation result with probability ranges, synthetic population impact, and strategic recommendations.
Do NOT use hardcoded predictions. Base it on logical progression.
Output JSON format:
{
  "id": "sim_${Math.random().toString(36).substring(7)}",
  "domain": "${config.domain}",
  "timeline": [
    { "year": 2026, "event": "Event description", "probability": 0.8 }
  ],
  "trends": [
    { "year": 2026, "value": 45 },
    { "year": 2027, "value": 55 }
  ],
  "population_impact": {
    "economic_shift": "Description",
    "social_shift": "Description"
  },
  "predicted_outcomes": [
    { "scenario": "Optimistic", "description": "...", "probability": 0.3 },
    { "scenario": "Pessimistic", "description": "...", "probability": 0.2 },
    { "scenario": "Most Likely", "description": "...", "probability": 0.5 }
  ],
  "recommended_strategies": [
    "Strategy 1",
    "Strategy 2"
  ]
}`;

        const res = await generateWithRetry(ai, {
            model: 'gemini-3.1-flash-lite',
            contents: prompt,
            config: { responseMimeType: "application/json" }
        }, 3);

        const data = await cleanJSON(res?.text || "{}", ai);
        return data;
    }
}
