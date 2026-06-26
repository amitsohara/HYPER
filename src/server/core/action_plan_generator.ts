import { GoogleGenAI } from "@google/genai";
import { generateWithRetry, cleanJSON } from "../engines.js";

export class ActionPlanGenerator {
  static async generate(ai: GoogleGenAI, normalizedData: any, focusContext?: string): Promise<any> {
    const focusInstruction = focusContext ? `\nDomain Focus: ${focusContext}\nEnsure the output emphasizes these aspects.` : "";
    const prompt = `You are the Action Plan Generator.
Mission: ${normalizedData.mission}
Data: ${JSON.stringify({
  goals: normalizedData.goals,
  executive_planning: normalizedData.executive_planning
}).substring(0, 5000)}
${focusInstruction}

Generate the roadmap, weekly action plan, stakeholder/investor strategy, key decisions, and next actions.

Return JSON:
{
  "roadmap": "...",
  "weekly_action_plan": "...",
  "investor_or_stakeholder_strategy": "...",
  "key_decisions": "...",
  "recommended_next_actions": ["Action 1", "Action 2"],
  "next_recommended_mission": "..."
}`;
    try {
      const res = await generateWithRetry(ai, {
        model: "gemini-1.5-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });
      return await cleanJSON(res?.text || "{}", ai) || {};
    } catch (e) {
      console.warn(e);
      return { 
        roadmap: "Unknown", 
        weekly_action_plan: "Unknown", 
        investor_or_stakeholder_strategy: "Unknown", 
        key_decisions: "Unknown", 
        recommended_next_actions: [], 
        next_recommended_mission: "Unknown" 
      };
    }
  }
}
