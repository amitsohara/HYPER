import { GoogleGenAI } from "@google/genai";
import { generateWithRetry, cleanJSON } from "../engines.js";

export class TradeoffAnalyzer {
  static async analyze(ai: GoogleGenAI, options: any[]): Promise<any> {
    const prompt = `Analyze the tradeoffs for the following candidate strategies:
${JSON.stringify(options, null, 2)}

For every option calculate a score (0-100) for each of these metrics:
- Technical Complexity
- Market Size
- Revenue Potential
- Investment Required
- Execution Difficulty
- Talent Availability
- Competition
- Legal Risk
- Ethical Risk
- Scalability
- Maintainability
- User Impact
- Long-Term Sustainability

Return a JSON object mapping option IDs to their metrics:
{
  "opt_1": {
    "technical_complexity": 80,
    "market_size": 90,
    ...
  }
}
`;

    try {
      const response = await generateWithRetry(ai, {
        model: "gemini-flash-latest",
        contents: prompt
      });
      return await cleanJSON(response?.text || "{}", ai);
    } catch (e) {
      console.warn("Tradeoff analysis failed", e);
      return {};
    }
  }
}
