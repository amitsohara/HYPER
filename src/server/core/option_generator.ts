import { GoogleGenAI } from "@google/genai";
import { generateWithRetry, cleanJSON } from "../engines.js";

export class OptionGenerator {
  static async generate(ai: GoogleGenAI, missionText: string, evidence: any[]): Promise<any[]> {
    const prompt = `Based on the mission: "${missionText}" and the evidence gathered, generate multiple distinct candidate strategies. 
Provide exactly 4 options. 
CRITICAL: ALL 4 options MUST be completely unique and mutually exclusive. DO NOT generate duplicate or highly similar strategies.

Each option should include:
- id: A unique identifier (e.g., "opt_1")
- description: A detailed description of the strategy
- expected_outcome: The expected result
- estimated_resources: The resources needed
- estimated_timeline: The expected timeline
- key_risks: Key risks associated
- assumptions: Assumptions made

Return as a JSON array of these options:
[
  {
    "id": "opt_1",
    "description": "...",
    "expected_outcome": "...",
    "estimated_resources": "...",
    "estimated_timeline": "...",
    "key_risks": ["..."],
    "assumptions": ["..."]
  }
]
`;

    try {
      const response = await generateWithRetry(ai, {
        model: "gemini-flash-lite-latest",
        contents: prompt,
        bypassBudget: true
      });
      let parsed = await cleanJSON(response?.text || "[]", ai);
      if (!parsed || parsed.length === 0) {
         parsed = [{
           id: "fallback_opt",
           description: "Default fallback strategy based on available information.",
           expected_outcome: "Partial completion",
           estimated_resources: "Minimal",
           estimated_timeline: "Immediate",
           key_risks: ["Lack of data"],
           assumptions: ["Basic assumptions"]
         }];
      }
      return parsed;
    } catch (e) {
      console.warn("Option generation failed", e);
      return [];
    }
  }
}
