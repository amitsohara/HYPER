import { GoogleGenAI } from "@google/genai";
import { generateWithRetry, cleanJSON } from "../../engines.js";

export interface ContradictionResult {
  contradictions: string[];
  severity: "none" | "low" | "medium" | "high";
  affected_sections: string[];
  repair_required: boolean;
}

export class ContradictionChecker {
  static async check(ai: GoogleGenAI, draftReport: any, strategicRecommendation: any): Promise<ContradictionResult> {
    const prompt = `You are a Logic and Contradiction Checker for mission planning.
Analyze the strategic recommendation and the draft report for logical contradictions.
For example, if the strategy recommends "Nuclear Power", but the report's key decisions prioritize "Solar Power", that is a contradiction.

Strategic Recommendation: ${JSON.stringify(strategicRecommendation)}
Draft Report Sections: ${JSON.stringify(draftReport)}

Identify contradictions.
Return JSON:
{
  "contradictions": ["Description of contradiction"],
  "severity": "none" | "low" | "medium" | "high",
  "affected_sections": ["Section names containing the conflicting info"]
}`;
    try {
        const res = await generateWithRetry(ai, {
            model: "gemini-1.5-flash",
            contents: prompt,
            config: { responseMimeType: "application/json", temperature: 0.1 }
        });
        const analysis = await cleanJSON(res.text, ai);
        
        let severity = analysis.severity || "none";
        if (!["none", "low", "medium", "high"].includes(severity)) severity = "none";
        
        return {
            contradictions: analysis.contradictions || [],
            severity: severity as any,
            affected_sections: analysis.affected_sections || [],
            repair_required: severity === "high" || severity === "medium" || (analysis.contradictions && analysis.contradictions.length > 0)
        };
    } catch (e) {
        return {
            contradictions: [],
            severity: "none",
            affected_sections: [],
            repair_required: false
        };
    }
  }
}
