import { GoogleGenAI } from "@google/genai";
import { generateWithRetry, cleanJSON } from "../engines.js";

export class SelfReflectionPlanner {
    static async reflect(ai: GoogleGenAI, understanding: any, capabilities: any[], selectedModules: any[], skippedModules: any[]) {
        const prompt = `You are the Self Reflection Planner of the Meta-Cognition Engine.
Review the current execution plan before it begins.
Answer these questions and optimize the plan:
1. Am I missing any important capability?
2. Are there low-relevance modules taking up budget? (DO NOT remove high-relevance modules just because they are expensive if they are critical to the mission).
3. Can this mission be solved more efficiently?
4. What assumptions am I making?
5. Should another module participate?

Mission Understanding:
${JSON.stringify(understanding)}

Currently Selected Modules:
${JSON.stringify(selectedModules.map(m => ({ module: m.module, relevance_score: m.relevance_score, cost: m.expected_cost })))}

Currently Skipped Modules:
${JSON.stringify(skippedModules.map(m => ({ module: m.module, relevance_score: m.relevance_score, cost: m.expected_cost })))}

Return a JSON object:
{
  "reflection_summary": "Summary of thoughts (must strongly justify any removals of high-scoring modules)",
  "missing_capabilities": ["list of capabilities missed"],
  "overused_modules": ["modules to drop (ONLY if they are low relevance)"],
  "efficiency_suggestions": "How to do this faster",
  "assumptions": ["list of assumptions"],
  "final_additions": ["modules to add from skipped"],
  "final_removals": ["modules to remove from selected (if removing a high-scoring module, you MUST explain why in reflection_summary)"]
}`;

        const res = await generateWithRetry(ai, {
            model: "gemini-flash-lite-latest",
            contents: prompt,
            bypassBudget: true,
            config: { responseMimeType: "application/json" }
        });

        return await cleanJSON(res?.text || "{}", ai);
    }
}
