import { GoogleGenAI } from "@google/genai";
import { generateWithRetry, cleanJSON } from "../../engines.js";
import { MissionMode } from "./token_budget_manager.js";

export class AdaptiveModuleRouter {
  static async route(ai: GoogleGenAI, mission: string, mode: MissionMode): Promise<{ active: string[], skipped: string[] }> {
    const allModules = [
      "scientific_discovery",
      "digital_twin",
      "world_model",
      "social_cognition",
      "agent_debate",
      "benchmark_results",
      "beliefs"
    ];

    if (mode === "deep") {
      return { active: allModules, skipped: [] };
    }
    
    if (mode === "fast") {
      // Pick top 2 for fast mode based on basic string matching or just defaults to avoid LLM call if possible
      return { active: ["world_model", "benchmark_results"], skipped: allModules.filter(m => !["world_model", "benchmark_results"].includes(m)) };
    }

    const prompt = `Given the mission: "${mission}" and the mode "${mode}", select the most relevant modules to run from this list to optimize resources:
${JSON.stringify(allModules)}

Return a JSON object containing an array "active" and an array "skipped":
{
  "active": ["module1", "module2"],
  "skipped": ["module3", "module4"]
}
`;

    try {
      const response = await generateWithRetry(ai, {
        model: "gemini-1.5-flash",
        contents: prompt
      });
      const result = await cleanJSON(response?.text || "{}", ai);
      const active = Array.isArray(result.active) ? result.active : allModules;
      const skipped = Array.isArray(result.skipped) ? result.skipped : [];
      return { active, skipped };
    } catch (e) {
      console.warn("Adaptive routing failed", e);
      return { active: allModules, skipped: [] };
    }
  }
}
