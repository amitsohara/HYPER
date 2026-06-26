import { GoogleGenAI } from "@google/genai";
import { generateWithRetry, cleanJSON } from "../engines.js";

export class ExecutiveSummaryGenerator {
  static async generate(ai: GoogleGenAI, normalizedData: any, focusContext?: string): Promise<any> {
    const focusInstruction = focusContext ? `\nDomain Focus: ${focusContext}\nEnsure the summary emphasizes these aspects.` : "";
    const prompt = `You are the Executive Summary Generator for a Mission Compiler.
Mission: ${normalizedData.mission}
Internal Data: ${JSON.stringify({
  goals: normalizedData.goals,
  plan: normalizedData.plan,
  report: normalizedData.final_report
}).substring(0, 5000)}
${focusInstruction}

Generate a concise executive summary.
Also estimate confidence_score (0-100), estimated_success_probability (0-100), overall_risk_level ("Low", "Medium", "High").

Return JSON:
{
  "executive_summary": "...",
  "confidence_score": 85,
  "estimated_success_probability": 80,
  "overall_risk_level": "Medium",
  "research_findings": "..."
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
      return { executive_summary: "Failed to generate.", confidence_score: 50, estimated_success_probability: 50, overall_risk_level: "High", research_findings: "" };
    }
  }
}
