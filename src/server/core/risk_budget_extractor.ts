import { GoogleGenAI } from "@google/genai";
import { generateWithRetry, cleanJSON } from "../engines.js";

export class RiskBudgetExtractor {
  static async extract(ai: GoogleGenAI, normalizedData: any, focusContext?: string): Promise<any> {
    const focusInstruction = focusContext ? `\nDomain Focus: ${focusContext}\nEnsure the output strictly adheres to this domain and avoids unrelated jargon (e.g., do not use startup terms like 'seed capital' or 'burn rate' for a geopolitical or scientific mission).` : "\nEnsure the output matches the mission's context and avoids unrelated jargon.";
    const prompt = `You are the Risk and Resource Extractor.
Mission: ${normalizedData.mission}
Mission Classification: ${JSON.stringify(normalizedData.classification)}
Data: ${JSON.stringify({
  social_cognition: normalizedData.social_cognition,
  world_model: normalizedData.world_model,
  plan: normalizedData.plan
}).substring(0, 5000)}
${focusInstruction}

Estimate the resources needed, risks and mitigations, and summarize simulations.
- For business: financial budget, burn rate, market risks.
- For research/science: computational resources, lab equipment, empirical risks.
- For geopolitical/social/general: human capital, systemic risks, infrastructure, societal consequences.

Return JSON:
{
  "budget_and_resources": "Context-appropriate resource requirements (money, time, people, or equipment)",
  "risks_and_mitigations": "Context-appropriate risks and their mitigations",
  "simulation_summary": "Summary of any simulated outcomes or world modeling"
}`;
    try {
      const res = await generateWithRetry(ai, {
        model: "gemini-flash-lite-latest",
        contents: prompt,
        bypassBudget: true,
        config: { responseMimeType: "application/json" }
      });
      return await cleanJSON(res?.text || "{}", ai) || {};
    } catch (e) {
      console.warn(e);
      return { budget_and_resources: "Unknown", risks_and_mitigations: "Unknown", simulation_summary: "Unknown" };
    }
  }
}
