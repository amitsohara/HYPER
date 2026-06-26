import { GoogleGenAI } from "@google/genai";
import { generateWithRetry, cleanJSON } from "../engines.js";

export class ActionPlanGenerator {
  static async generate(ai: GoogleGenAI, normalizedData: any, focusContext?: string): Promise<any> {
    const focusInstruction = focusContext ? `\nDomain Focus: ${focusContext}\nEnsure the output strictly adheres to this domain and avoids unrelated jargon (e.g., do not use startup/business terms for a geopolitical or scientific mission).` : "\nEnsure the output matches the mission's context and avoids unrelated jargon (e.g., no startup jargon for non-business missions).";
    const prompt = `You are the Action Plan Generator.
Mission: ${normalizedData.mission}
Mission Classification: ${JSON.stringify(normalizedData.classification)}
Data: ${JSON.stringify({
  goals: normalizedData.goals,
  executive_planning: normalizedData.executive_planning
}).substring(0, 5000)}
${focusInstruction}

Generate a context-appropriate execution plan.
- For business: roadmap, weekly plan, stakeholder strategy.
- For research/science: experimental phases, methodology, peer review steps.
- For geopolitical/social: impact analysis phases, diplomatic steps, societal interventions.

Return JSON:
{
  "roadmap": "A phased approach to achieving the mission",
  "weekly_action_plan": "Specific short-term actions",
  "stakeholder_strategy": "How to manage or communicate with involved parties (replace 'investor' with appropriate term like 'citizens', 'peers', 'governments' etc.)",
  "key_decisions": "Critical choices made",
  "recommended_next_actions": ["Action 1", "Action 2"],
  "next_recommended_mission": "A logical follow-up mission"
}`;
    try {
      const res = await generateWithRetry(ai, {
        model: "gemini-flash-lite-latest",
        contents: prompt,
        bypassBudget: true,
        config: { responseMimeType: "application/json" }
      });
      const parsed = await cleanJSON(res?.text || "{}", ai) || {};
      
      // Ensure backward compatibility with the report generator structure
      if (parsed.stakeholder_strategy && !parsed.investor_or_stakeholder_strategy) {
         parsed.investor_or_stakeholder_strategy = parsed.stakeholder_strategy;
      }
      return parsed;
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
