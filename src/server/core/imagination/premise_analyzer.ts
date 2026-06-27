import { GoogleGenAI } from "@google/genai";
import { generateWithRetry, cleanJSON } from "../../engines.js";

export class PremiseAnalyzer {
  static async analyze(ai: GoogleGenAI, mission: string): Promise<any> {
    const prompt = `Analyze the premise of the following mission to determine if it is ambiguous, impossible, contradictory, underdefined, or hypothetical.

Mission: "${mission}"

Return a JSON object:
{
  "premise_type": "string (e.g., standard, hypothetical, counterfactual, impossible, ambiguous, unknown_domain)",
  "clarity_score": number (0-100),
  "contradictions": ["list of contradictions, if any"],
  "missing_assumptions": ["list of assumptions required to solve"],
  "required_reframing": "string describing how to reframe the problem if impossible or ambiguous",
  "possible_interpretations": ["list of alternative interpretations if ambiguous"],
  "confidence": number (0-100)
}`;
    
    try {
      const res = await generateWithRetry(ai, {
        model: "gemini-1.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.3
        }
      });
      return await cleanJSON(res.text, ai);
    } catch (e) {
      console.error("PremiseAnalyzer Error:", e);
      return {
        premise_type: "unknown",
        clarity_score: 50,
        contradictions: [],
        missing_assumptions: [],
        required_reframing: "Proceed with caution",
        possible_interpretations: [],
        confidence: 0
      };
    }
  }
}
