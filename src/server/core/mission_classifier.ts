import { GoogleGenAI } from "@google/genai";
import { generateWithRetry, cleanJSON } from "../engines.js";

export class MissionClassifier {
  static async classify(ai: GoogleGenAI, missionText: string): Promise<{ type: string; stage: string }> {
    const prompt = `Analyze the following mission objective and classify it.
Determine the domain type and the current stage of the mission.

Categories for Domain Type:
- business (e.g., startup, sales, scaling)
- healthcare (e.g., medical research, hospital ops)
- research (e.g., scientific discovery, paper writing)
- manufacturing (e.g., factory ops, supply chain, robotics)
- government (e.g., policy, urban planning)
- software (e.g., building apps, AI)
- general (anything else)

Categories for Stage:
- ideation (early stage, brainstorming)
- planning (creating roadmaps, budgeting)
- execution (active building, launching)
- scaling (growth, optimization)

Mission: "${missionText}"

Return a JSON object with:
{
  "type": "string",
  "stage": "string"
}
Ensure the output is valid JSON.`;

    try {
      const response = await generateWithRetry(ai, {
        model: "gemini-flash-lite-latest",
        contents: prompt,
        bypassBudget: true
      });
      const parsed = await cleanJSON(response?.text || "{}", ai);
      return {
        type: parsed.type || "general",
        stage: parsed.stage || "planning"
      };
    } catch (e) {
      console.warn("Mission classification failed, defaulting to general/planning", e);
      return { type: "general", stage: "planning" };
    }
  }
}
