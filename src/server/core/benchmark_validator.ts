import { generateWithRetry } from "../engines.js";
import { GoogleGenAI } from "@google/genai";

export async function validateImprovement(ai: GoogleGenAI, improvement: any) {
    // In a real system, we'd run test missions.
    // For now, we simulate benchmark validation using the LLM to review the improvement.
    const prompt = `Evaluate this proposed improvement against our benchmark criteria.
Require a minimum +5% improvement and no regression greater than 3% in any category.

Improvement:
${JSON.stringify(improvement, null, 2)}

Respond with JSON:
{
  "accepted": true/false,
  "reason": "string",
  "benchmark_results": {
    "old_strategy_score": number,
    "new_strategy_score": number
  },
  "regression_detected": true/false
}
`;
    try {
    const res = await generateWithRetry(ai, {
        model: "gemini-flash-lite-latest",
        contents: prompt,
        config: { responseMimeType: "application/json" }
    }, 3);
    return JSON.parse(res?.text || '{"accepted":false, "reason":"validation failed", "benchmark_results":{"old_strategy_score":0, "new_strategy_score":0}, "regression_detected":true}');
  } catch(e) {
    return {accepted:false, reason:"error during validation", benchmark_results:{old_strategy_score:0, new_strategy_score:0}, regression_detected:true};
  }
}
