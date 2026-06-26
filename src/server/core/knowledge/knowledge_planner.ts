import { GoogleGenAI } from "@google/genai";
import { generateWithRetry } from "../../engines.js";

export async function planKnowledgeAcquisition(ai: GoogleGenAI, missionStatement: string) {
    const prompt = `Analyze this mission and determine what specific knowledge needs to be acquired.
Mission: ${missionStatement}

Respond in JSON format:
{
  "knowledge_needs": [
    {
      "query": "string",
      "rationale": "string",
      "preferred_sources": ["web", "research_paper", "patent", "github", "news", "government"]
    }
  ]
}
`;
    try {
        const res = await generateWithRetry(ai, {
            model: "gemini-flash-lite-latest",
            contents: prompt,
        bypassBudget: true,
            config: { responseMimeType: "application/json" }
        }, 3);
        return JSON.parse(res?.text || '{"knowledge_needs":[]}').knowledge_needs || [];
    } catch(e) {
        return [];
    }
}
