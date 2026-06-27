import { GoogleGenAI } from "@google/genai";
import { generateWithRetry, cleanJSON } from "../../engines.js";

export class ReflectionEngine {
    static async reflect(ai: GoogleGenAI, missionData: any): Promise<any> {
        const prompt = `You are the HyperMind Reflection Engine.
Analyze this mission execution and extract a structured reflection.

Mission: ${missionData.mission}
Report/Outcome: ${JSON.stringify(missionData.report)}
Reasoning Trace: ${JSON.stringify(missionData.reasoning_summary || {})}
Evidence: ${JSON.stringify(missionData.evidence || [])}

Return a valid JSON object matching this structure:
{
  "mission_answered": boolean,
  "what_worked": ["..."],
  "what_failed": ["..."],
  "weak_assumptions": ["..."],
  "missed_items": ["..."],
  "contradictions": ["..."],
  "domain_alignment_issues": ["..."],
  "evidence_gaps": ["..."],
  "reasoning_gaps": ["..."],
  "planning_gaps": ["..."],
  "improvement_opportunities": ["..."],
  "reflection_summary": "Overall reflection summary"
}
`;
        try {
            const response = await generateWithRetry(ai, {
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: { responseMimeType: "application/json" }
            });
            let parsed = await cleanJSON(response?.text || "{}", ai);
            if (process.env.MODEL_MODE === 'dev_stub' && (!parsed.reflection_summary || parsed.provider_used)) {
                 parsed = { 
                     mission_answered: true,
                     what_worked: ["Mock worked"],
                     what_failed: ["Mock failed"],
                     reflection_summary: "Mock reflection" 
                 };
            }
            return parsed;
        } catch (e) {
            console.error("[HECS] ReflectionEngine failed", e);
            return {
                mission_answered: false,
                reflection_summary: "Failed to generate reflection."
            };
        }
    }
}
