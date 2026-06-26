import { GoogleGenAI } from "@google/genai";
import { generateWithRetry } from "../../engines.js";

export async function rankEvidence(ai: GoogleGenAI, evidenceList: any[], mission: string) {
    if (!evidenceList || evidenceList.length === 0) return [];
    
    const prompt = `Rank and score the following evidence items based on relevance to the mission.
Mission: ${mission}
Evidence:
${JSON.stringify(evidenceList.map(e => ({ url: e.url, summary: e.summary })), null, 2)}

Respond with JSON:
{
  "ranked_evidence": [
    {
      "url": "string",
      "relevance_score": 85,
      "confidence_score": 90
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
        const rankings = JSON.parse(res?.text || '{"ranked_evidence":[]}').ranked_evidence || [];
        
        return evidenceList.map(ev => {
            const rank = rankings.find((r: any) => r.url === ev.url);
            if (rank) {
                ev.relevance_score = rank.relevance_score || 50;
                ev.confidence_score = rank.confidence_score || 50;
            } else {
                ev.relevance_score = 50;
                ev.confidence_score = 50;
            }
            return ev;
        }).sort((a, b) => (b.relevance_score + b.confidence_score + b.credibility_score) - (a.relevance_score + a.confidence_score + a.credibility_score));
    } catch(e) {
        return evidenceList;
    }
}