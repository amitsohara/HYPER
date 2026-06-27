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
        model: "gemini-2.5-flash",
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

  static async generateFromState(ai: GoogleGenAI, state: any): Promise<any> {
    const prompt = `You are the Executive Execution Engine.
Mission: ${state.mission}
Understanding: ${JSON.stringify(state.understanding || {}).substring(0, 1000)}
Decision / Strategy: ${JSON.stringify(state.decision?.recommendation?.strategy || state.decision || {})}
Imagined Constraints/Rules: ${JSON.stringify(state.imagination?.imagined_world?.rules || [])}
Predictions: ${JSON.stringify(state.prediction?.outcomes || [])}

Generate a highly specific, domain-appropriate execution plan based on the chosen strategy.
DO NOT output generic boilerplate. Use concrete details from the imagination and decision steps (e.g., if the mission is Mars City, list specific aerospace actions like ISRU deployment, habitat shielding, etc).

Return JSON:
{
  "roadmap": "A clear, phased approach to achieving the mission",
  "immediate_actions": ["Action 1", "Action 2"],
  "key_milestones": ["Milestone 1", "Milestone 2"],
  "risk_mitigation_steps": ["Step 1", "Step 2"]
}`;

    try {
      const res = await generateWithRetry(ai, {
        model: "gemini-2.5-flash",
        contents: prompt,
        bypassBudget: true,
        config: { responseMimeType: "application/json" }
      });
      return await cleanJSON(res?.text || "{}", ai) || {};
    } catch (e) {
      console.warn("Failed to generate from state", e);
      return { plan: [] };
    }
  }
}
