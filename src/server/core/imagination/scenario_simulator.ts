import { GoogleGenAI } from "@google/genai";
import { generateWithRetry, cleanJSON } from "../../engines.js";

export class ScenarioSimulator {
  static async simulate(ai: GoogleGenAI, mission: string, worldModel: any): Promise<any[]> {
    const prompt = `Simulate multiple futures for the following mission in the imagined world.

Mission: "${mission}"
World Model: ${JSON.stringify(worldModel)}

Include scenarios such as:
- best case
- worst case
- most likely
- resource failure
- human/system failure
- unexpected discovery

Return a JSON array of scenario objects:
[
  {
    "name": "string (e.g., Best Case, Resource Failure)",
    "assumptions": ["key conditions for this scenario"],
    "events": ["sequence of events that occur"],
    "outcomes": ["final results"],
    "risks": ["major risks realized"],
    "confidence": number (0-100)
  }
]`;
    
    try {
      const res = await generateWithRetry(ai, {
        model: "gemini-1.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.7
        }
      });
      return await cleanJSON(res.text, ai) || [];
    } catch (e) {
      console.error("ScenarioSimulator Error:", e);
      return [];
    }
  }
}
