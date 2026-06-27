import { GoogleGenAI } from "@google/genai";
import { generateWithRetry, cleanJSON } from "../engines.js";

export class MissionClassifier {
  static async classify(ai: GoogleGenAI, missionText: string): Promise<{ type: string; stage: string }> {
    const prompt = `Analyze the following mission objective and classify it.
Determine the highly specific industry/domain type (e.g., Aerospace Engineering, Planetary Settlement, Biotechnology, Quantum Computing) and the current stage of the mission.
DO NOT use generic terms like 'general' or 'business'.

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
        model: "gemini-1.5-flash",
        contents: prompt,
        bypassBudget: true
      });
      const parsed = await cleanJSON(response?.text || "{}", ai);
      return {
        type: parsed.type || "Aerospace / Systems Engineering / Planetary Settlement",
        stage: parsed.stage || "planning"
      };
    } catch (e) {
      console.warn("Mission classification failed, defaulting to general/planning", e);
      return { type: "Aerospace / Systems Engineering / Planetary Settlement", stage: "planning" };
    }
  }
}
