import { generateWithRetry } from "../engines.js";
import { GoogleGenAI } from "@google/genai";
import { v4 as uuidv4 } from "uuid";

export async function generateImprovements(ai: GoogleGenAI, weaknesses: any[]) {
    if (!weaknesses || weaknesses.length === 0) return [];
    
    const prompt = `Based on the following detected weaknesses in recent missions, generate candidate improvements for our Cognitive Architecture.
Types of improvements:
1. Prompt improvement
2. Compiler improvement
3. Router improvement
4. Evaluation rubric improvement
5. Report template improvement
6. Decision criteria improvement
7. Strategy improvement

Weaknesses:
${JSON.stringify(weaknesses, null, 2)}

Respond with JSON:
{
  "improvements": [
    {
      "target_component": "string",
      "before": "string",
      "after": "string",
      "expected_benefit": "string",
      "risk": "string",
      "test_plan": "string"
    }
  ]
}
`;
    try {
    const res = await generateWithRetry(ai, {
        model: "gemini-flash-latest",
        contents: prompt,
        config: { responseMimeType: "application/json" }
    }, 3);
    const data = JSON.parse(res?.text || '{"improvements":[]}');
    return (data.improvements || []).map((imp: any) => ({
        improvement_id: uuidv4(),
        ...imp
    }));
  } catch(e) {
    return [];
  }
}
