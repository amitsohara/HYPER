import { generateWithRetry } from "../engines.js";
import { GoogleGenAI } from "@google/genai";

export async function evaluateMission(ai: GoogleGenAI, report: string) {
    const prompt = `Evaluate the following mission report on a scale of 0-100 based on these criteria:
- mission_alignment
- reasoning_quality
- actionability
- specificity
- evidence_quality
- risk_awareness
- feasibility
- domain_fit
- user_value
- completeness

Report:
${report}

Respond in JSON format:
{
  "score": 85,
  "reasoning": "Detailed reasoning here..."
}
`;
    try {
    const res = await generateWithRetry(ai, {
        model: "gemini-2.5-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" }
    }, 3);
    return JSON.parse(res?.text || '{"score": 50, "reasoning": "Fallback due to error"}');
  } catch(e) {
    return {score: 50, reasoning: "Error evaluating: " + String(e)};
  }
}
