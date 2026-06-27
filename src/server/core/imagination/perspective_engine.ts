import { GoogleGenAI } from "@google/genai";
import { generateWithRetry, cleanJSON } from "../../engines.js";

export class PerspectiveEngine {
  static async generatePerspectives(ai: GoogleGenAI, mission: string, worldModel: any): Promise<any[]> {
    const prompt = `Place an operational viewpoint inside the following imagined world for the given mission. 
Generate multiple distinct perspectives (e.g., engineer, colonist, doctor, maintenance system) that exist in this scenario.
This represents operational perspective-taking, not consciousness.

Mission: "${mission}"
World Model: ${JSON.stringify(worldModel)}

Return a JSON array of perspective objects:
[
  {
    "perspective_role": "string (e.g., engineer, farmer, user, competitor)",
    "observations": ["what this perspective sees/knows"],
    "needs": ["what this perspective requires to function"],
    "risks": ["threats specific to this perspective"],
    "opportunities": ["potential benefits or actions they can take"],
    "actions": ["likely actions this role would take"],
    "conflicts": ["conflicts with other roles or the environment"]
  }
]`;
    
    try {
      const res = await generateWithRetry(ai, {
        model: "gemini-1.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.6
        }
      });
      return await cleanJSON(res.text, ai) || [];
    } catch (e) {
      console.error("PerspectiveEngine Error:", e);
      return [];
    }
  }
}
