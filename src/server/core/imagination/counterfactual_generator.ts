import { GoogleGenAI } from "@google/genai";
import { generateWithRetry, cleanJSON } from "../../engines.js";

export class CounterfactualGenerator {
  static async generate(ai: GoogleGenAI, mission: string, worldModel: any): Promise<any[]> {
    const prompt = `Generate "what if" variations (counterfactuals) for the following mission in the imagined world.

Mission: "${mission}"
World Model: ${JSON.stringify(worldModel)}

Generate variations that change key rules, resources, or assumptions (e.g., "What if water is unavailable?", "What if gravity changes?", "What if a key assumption is false?").

Return a JSON array of counterfactual objects:
[
  {
    "what_if": "The 'what if' question",
    "changed_variable": "The specific rule, resource, or assumption altered",
    "immediate_effect": "What happens immediately",
    "downstream_impact": "Long-term consequences",
    "mitigation": "How to handle this counterfactual"
  }
]`;
    
    try {
      const res = await generateWithRetry(ai, {
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.8
        }
      });
      return await cleanJSON(res.text, ai) || [];
    } catch (e) {
      console.error("CounterfactualGenerator Error:", e);
      return [];
    }
  }
}
