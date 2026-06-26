import { GoogleGenAI } from "@google/genai";
import { generateWithRetry, cleanJSON } from "../engines.js";

export class ConfidenceCalculator {
  static async calculate(ai: GoogleGenAI, missionText: string, topOption: any, evidence: any[]): Promise<any> {
    const prompt = `Calculate the confidence level for the recommended strategy for the mission: "${missionText}".

Recommended Strategy:
${JSON.stringify(topOption, null, 2)}

Evidence Summary:
${JSON.stringify(evidence).substring(0, 5000)}

Calculate the confidence score (0-100) based on Evidence Quality, Agreement Between Modules, Simulation Consistency, Research Support, Knowledge Coverage, and Missing Information.

Return a JSON object:
{
  "confidence_score": 84,
  "confidence_reasoning": "...",
  "uncertainty": "..."
}
`;

    try {
      const response = await generateWithRetry(ai, {
        model: "gemini-1.5-flash",
        contents: prompt
      });
      return await cleanJSON(response?.text || "{}", ai);
    } catch (e) {
      console.warn("Confidence calculation failed", e);
      return { confidence_score: 50, confidence_reasoning: "Failed to calculate.", uncertainty: "High" };
    }
  }
}
