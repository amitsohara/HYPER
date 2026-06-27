import { GoogleGenAI } from "@google/genai";
import { generateWithRetry, cleanJSON } from "../../engines.js";

export class InternalWorldModel {
  static async build(ai: GoogleGenAI, mission: string, premiseAnalysis: any): Promise<any> {
    const prompt = `Construct a structured internal world model based on the following mission and its premise analysis. Do not generate images.

Mission: "${mission}"
Premise Analysis: ${JSON.stringify(premiseAnalysis)}

Build an imagined world that models the scenario, including its rules, constraints, and resources.

Return a JSON object:
{
  "world_name": "string",
  "environment": "description of the environment/setting",
  "entities": ["list of key objects, organizations, or concepts"],
  "rules": ["physical, social, or logical rules governing this world"],
  "constraints": ["limitations present in this scenario"],
  "resources": ["available resources"],
  "actors": ["key people, groups, or agents"],
  "systems": ["interacting systems (e.g., economy, gravity, infrastructure)"],
  "timeline": "brief description of the timeline or current state",
  "unknowns": ["list of unknown variables or missing information"]
}`;
    
    try {
      const res = await generateWithRetry(ai, {
        model: "gemini-1.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.5
        }
      });
      return await cleanJSON(res.text, ai);
    } catch (e) {
      console.error("InternalWorldModel Error:", e);
      return {
        world_name: "Fallback World",
        environment: "Unknown",
        entities: [],
        rules: [],
        constraints: [],
        resources: [],
        actors: [],
        systems: [],
        timeline: "Unknown",
        unknowns: []
      };
    }
  }
}
