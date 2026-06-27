import { GoogleGenAI } from "@google/genai";
import { generateWithRetry, cleanJSON } from "../../engines.js";

export class PossibilitySpaceMapper {
  static async map(ai: GoogleGenAI, scenarios: any[], counterfactuals: any[]): Promise<any> {
    const prompt = `Map the possibility space based on the simulated scenarios and counterfactuals.

Scenarios: ${JSON.stringify(scenarios)}
Counterfactuals: ${JSON.stringify(counterfactuals)}

Categorize the possible solution paths.

Return a JSON object:
{
  "feasible_paths": ["Paths that are highly likely to succeed"],
  "impossible_paths": ["Paths that lead to failure or violate constraints"],
  "unknown_paths": ["Paths where outcomes are highly uncertain"],
  "high_risk_high_reward_paths": ["Paths with high potential but dangerous risks"],
  "safest_paths": ["The most conservative and reliable paths"]
}`;
    
    try {
      const res = await generateWithRetry(ai, {
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.4
        }
      });
      return await cleanJSON(res.text, ai);
    } catch (e) {
      console.error("PossibilitySpaceMapper Error:", e);
      return {
        feasible_paths: [],
        impossible_paths: [],
        unknown_paths: [],
        high_risk_high_reward_paths: [],
        safest_paths: []
      };
    }
  }
}
