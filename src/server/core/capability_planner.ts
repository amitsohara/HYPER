import { GoogleGenAI } from "@google/genai";
import { generateWithRetry, cleanJSON } from "../engines.js";
import { CapabilityRegistry } from "./capability_registry.js";

export class CapabilityPlanner {
    static async inferCapabilities(ai: GoogleGenAI, missionGraph: any, understanding: any) {
        const registry = CapabilityRegistry.getRegistry();
        
        const prompt = `You are the Capability Planner of the Meta-Cognition Engine.
Based on the Mission Graph and Understanding, infer the required cognitive capabilities.
DO NOT use hardcoded keywords. Use semantic reasoning to map the mission's needs to the available modules.

Mission Understanding:
${JSON.stringify(understanding)}

Mission Graph:
${JSON.stringify(missionGraph)}

Available Capabilities and Modules:
${JSON.stringify(registry)}

For each module, calculate its utility for this specific mission.
Return a JSON array of objects:
[
  {
    "module": "module_name",
    "relevance_score": 0-100,
    "contribution_score": 0-100,
    "reasoning": "Why this module is relevant or not based on semantics, not keywords",
    "expected_benefit": "What it adds",
    "expected_cost": "High/Medium/Low",
    "confidence": 0-100
  }
]
`;

        const res = await generateWithRetry(ai, {
            model: "gemini-1.5-flash",
            contents: prompt,
            bypassBudget: true,
            config: { responseMimeType: "application/json" }
        });

        return await cleanJSON(res?.text || "[]", ai);
    }
}
