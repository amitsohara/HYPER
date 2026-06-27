import { GoogleGenAI } from "@google/genai";
import { generateWithRetry, cleanJSON } from "../engines.js";

export class ExecutiveSummaryGenerator {
  static async generate(ai: GoogleGenAI, normalizedData: any, focusContext?: string): Promise<any> {
    const focusInstruction = focusContext ? `\nDomain Focus: ${focusContext}\nEnsure the summary strictly adheres to this domain and avoids unrelated jargon.` : "\nEnsure the summary matches the mission's context and avoids unrelated jargon.";
    const prompt = `You are the Executive Summary Generator for a Mission Compiler.
Mission: ${normalizedData.mission}
Mission Classification: ${JSON.stringify(normalizedData.classification)}
Internal Data: ${JSON.stringify({
  goals: normalizedData.goals,
  plan: normalizedData.plan,
  report: normalizedData.final_report
}).substring(0, 5000)}
${focusInstruction}

Generate a concise executive summary tailored to the specific domain.
Also estimate confidence_score (0-100), estimated_success_probability (0-100), overall_risk_level ("Low", "Medium", "High"), and a summary of research findings.

Return JSON:
{
  "executive_summary": "High-level summary of the mission plan and outcomes",
  "confidence_score": 85,
  "estimated_success_probability": 80,
  "overall_risk_level": "Medium",
  "research_findings": "Summary of facts, evidence, or empirical findings gathered"
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
      console.warn(e);
      return { executive_summary: "Failed to generate.", confidence_score: 50, estimated_success_probability: 50, overall_risk_level: "High", research_findings: "" };
    }
  }
}
