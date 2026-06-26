import { GoogleGenAI } from "@google/genai";
import { generateWithRetry, cleanJSON } from "../engines.js";

export class RiskBudgetExtractor {
  static async extract(ai: GoogleGenAI, normalizedData: any, focusContext?: string): Promise<any> {
    const focusInstruction = focusContext ? `\nDomain Focus: ${focusContext}\nEnsure the output emphasizes these aspects.` : "";
    const prompt = `You are the Risk and Budget Extractor.
Mission: ${normalizedData.mission}
Data: ${JSON.stringify({
  social_cognition: normalizedData.social_cognition,
  world_model: normalizedData.world_model,
  plan: normalizedData.plan
}).substring(0, 5000)}
${focusInstruction}

Estimate the budget, resources needed, risks and mitigations, and summarize simulations.

Return JSON:
{
  "budget_and_resources": "...",
  "risks_and_mitigations": "...",
  "simulation_summary": "..."
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
      return { budget_and_resources: "Unknown", risks_and_mitigations: "Unknown", simulation_summary: "Unknown" };
    }
  }
}
