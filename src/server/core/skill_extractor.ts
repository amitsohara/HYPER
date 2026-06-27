import { generateWithRetry } from "../engines.js";
import { GoogleGenAI } from "@google/genai";
import { v4 as uuidv4 } from "uuid";

export async function extractSkills(ai: GoogleGenAI, report: string, missionId: string) {
    const prompt = `Extract reusable skills from this successful mission report.
Examples of skills:
- startup_roadmap_generation
- budget_estimation
- investor_strategy_creation
- risk_mitigation_planning
- research_synthesis
- mission_classification
- token_efficient_routing
- strategic_recommendation_ranking

Report:
${report}

Respond with JSON:
{
  "skills": [
    {
      "skill_name": "string",
      "domain": "string",
      "description": "string",
      "trigger_conditions": ["string"],
      "steps": ["string"],
      "success_evidence": "string"
    }
  ]
}
`;
    try {
    const res = await generateWithRetry(ai, {
        model: "gemini-2.5-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" }
    }, 3);
    const data = JSON.parse(res?.text || '{"skills":[]}');
    return (data.skills || []).map((s: any) => ({
        skill_id: uuidv4(),
        ...s,
        source_mission_ids: [missionId],
        version: 1,
        success_rate: 100
    }));
  } catch(e) {
    return [];
  }
}
