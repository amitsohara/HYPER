import { GoogleGenAI } from "@google/genai";
import { generateWithRetry, cleanJSON } from "../engines.js";

export class DecisionRanker {
  static async rank(ai: GoogleGenAI, missionText: string, options: any[], tradeoffs: any): Promise<any[]> {
    const prompt = `Rank the following candidate strategies based on their overall strength, feasibility, and alignment with the mission: "${missionText}".

Candidate Strategies:
${JSON.stringify(options, null, 2)}

Tradeoffs:
${JSON.stringify(tradeoffs, null, 2)}

Return a JSON array of the option IDs, ordered from best to worst, along with an overall score (0-100) and reasoning:
[
  {
    "id": "opt_1",
    "score": 91,
    "reason": "..."
  }
]
`;

    try {
      const response = await generateWithRetry(ai, {
        model: "gemini-1.5-flash",
        contents: prompt
      });
      return await cleanJSON(response?.text || "[]", ai);
    } catch (e) {
      console.warn("Decision ranking failed", e);
      return [];
    }
  }
}
