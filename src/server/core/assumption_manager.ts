import { GoogleGenAI } from "@google/genai";
import { generateWithRetry, cleanJSON } from "../engines.js";

export class AssumptionManager {
  static async extract(ai: GoogleGenAI, options: any[]): Promise<any> {
    const prompt = `For each of the following strategies, analyze their core assumptions:
${JSON.stringify(options, null, 2)}

For every option, detail the assumptions made, providing the confidence (0-100), evidence, and uncertainty level (Low, Medium, High).
Return a JSON object mapping option IDs to an array of analyzed assumptions:
{
  "opt_1": [
    {
      "assumption": "...",
      "confidence": 72,
      "evidence": "...",
      "uncertainty": "Medium"
    }
  ]
}
`;

    try {
      const response = await generateWithRetry(ai, {
        model: "gemini-flash-latest",
        contents: prompt
      });
      return await cleanJSON(response?.text || "{}", ai);
    } catch (e) {
      console.warn("Assumption extraction failed", e);
      return {};
    }
  }
}
