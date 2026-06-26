import { generateWithRetry } from "../engines.js";
import { GoogleGenAI } from "@google/genai";

export async function detectWeaknesses(ai: GoogleGenAI, report: string) {
    const prompt = `Analyze the following mission report and detect weaknesses such as:
- generic answer
- missing budget
- weak roadmap
- unclear next actions
- unsupported confidence
- wrong mission stage
- poor domain fit
- missing risks
- no strategic decision
- excessive token usage
- irrelevant modules activated

Report:
${report}

Respond with JSON:
{
  "weaknesses": [
    {
      "weakness_type": "string",
      "severity": "low|medium|high",
      "evidence": "string",
      "likely_cause": "string",
      "recommended_fix": "string"
    }
  ]
}
`;
    try {
    const res = await generateWithRetry(ai, {
        model: "gemini-flash-lite-latest",
        contents: prompt,
        config: { responseMimeType: "application/json" }
    }, 3);
    return JSON.parse(res?.text || '{"weaknesses":[]}').weaknesses || [];
  } catch(e) {
    return [];
  }
}
