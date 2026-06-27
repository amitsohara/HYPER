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
      "beliefs",
      "multi_agent_society",
      "recursive_improvement",
      "autonomous_learning",
      "embodied_intelligence",
      "theory_of_mind",
      "common_sense",
      "collective_intelligence",
      "knowledge_graph"
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

CRITICAL TOKEN LIMIT: For "balanced" mode, you MUST select NO MORE THAN 2 modules. The remaining modules MUST be put in "skipped".

CRITICAL RULE: Run "social_cognition" for ANY mission involving: climate, disaster, health, jobs, education, government, policy, business, leadership, conflict, society, humans, agriculture, migration, or poverty. If the mission touches human/social effects, "social_cognition" MUST be in the "active" array.

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
