import { GoogleGenAI } from "@google/genai";
import { generateWithRetry, cleanJSON } from "../../engines.js";

export class UnknownProblemSolver {
  static async solve(ai: GoogleGenAI, mission: string, possibilitySpace: any, premiseAnalysis: any): Promise<any> {
    const prompt = `Solve an unknown or novel problem using the mapped possibility space and premise analysis.

Mission: "${mission}"
Premise Analysis: ${JSON.stringify(premiseAnalysis)}
Possibility Space: ${JSON.stringify(possibilitySpace)}

Steps:
1. Define assumptions
2. Generate hypotheses based on feasible and safe paths
3. Detect contradictions
4. Produce an uncertain but useful answer

Return a JSON object:
{
  "best_explanation": "The most likely solution or explanation",
  "alternative_explanations": ["Other plausible solutions"],
  "assumptions": ["Key assumptions made to reach the solution"],
  "reasoning_summary": "Summary of the logical steps taken",
  "confidence": number (0-100),
  "uncertainty": "Description of what is still unknown or uncertain",
  "evidence_needed": ["Information required to confirm the hypothesis"],
  "next_experiments": ["Actions to test the solution"]
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
      console.error("UnknownProblemSolver Error:", e);
      return {
        best_explanation: "Failed to generate solution",
        alternative_explanations: [],
        assumptions: [],
        reasoning_summary: "Error occurred",
        confidence: 0,
        uncertainty: "High",
        evidence_needed: [],
        next_experiments: []
      };
    }
  }
}
