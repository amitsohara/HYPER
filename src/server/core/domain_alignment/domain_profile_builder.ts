import { GoogleGenAI } from "@google/genai";
import { generateWithRetry, cleanJSON } from "../../engines.js";

export interface DomainProfile {
  primary_domain: string;
  secondary_domains: string[];
  mission_type: string;
  mission_stage: string;
  expected_report_style: string;
  expected_stakeholders: string[];
  expected_actions: string[];
  expected_metrics: string[];
  expected_constraints: string[];
  expected_vocabulary: string[];
  suspicious_vocabulary: string[];
  forbidden_template_patterns: string[];
}

export class DomainProfileBuilder {
  static async build(ai: GoogleGenAI, mission: string, rawMissionResult: any): Promise<DomainProfile> {
    const prompt = `You are the Domain Profile Builder. Analyze this mission and generate a precise domain profile.

Mission: "${mission}"
Context:
- Understanding: ${JSON.stringify(rawMissionResult?.meta_cognition?.understanding || {})}
- Mission Graph: ${JSON.stringify(rawMissionResult?.meta_cognition?.mission_graph || {})}
- Knowledge Acquisition: ${JSON.stringify(rawMissionResult?.meta_cognition?.knowledge_acquisition || {})}
- Selected Modules: ${JSON.stringify(rawMissionResult?.meta_cognition?.selected_modules || [])}

Your job is to identify the EXACT domain and the vocabulary appropriate for it, and strictly identify vocabulary from OTHER domains that would be "leakage".
For example, if the mission is "Build a city on Mars", the domain is Aerospace/Systems Engineering. Expected vocabulary: ISRU, regolith, radiation shielding. Suspicious vocabulary: MVP, ICP, GTM, CAC/LTV, seed investors.

Return a JSON object conforming exactly to this structure:
{
  "primary_domain": "String",
  "secondary_domains": ["String"],
  "mission_type": "String",
  "mission_stage": "String",
  "expected_report_style": "String (e.g., Technical Engineering Report, Business Plan, Policy Brief)",
  "expected_stakeholders": ["String"],
  "expected_actions": ["String"],
  "expected_metrics": ["String"],
  "expected_constraints": ["String"],
  "expected_vocabulary": ["String"],
  "suspicious_vocabulary": ["String - TERMS THAT SHOULD NEVER APPEAR HERE"],
  "forbidden_template_patterns": ["String - e.g., 'startup financial metrics', 'software agile sprints'"]
}
`;
    try {
      const res = await generateWithRetry(ai, {
        model: "gemini-1.5-flash",
        contents: prompt,
        config: { responseMimeType: "application/json", temperature: 0.2 }
      });
      return await cleanJSON(res.text, ai) as DomainProfile;
    } catch (e) {
      console.warn("DomainProfileBuilder failed, using fallback.", e);
      return {
        primary_domain: "General",
        secondary_domains: [],
        mission_type: "General",
        mission_stage: "Planning",
        expected_report_style: "General Report",
        expected_stakeholders: [],
        expected_actions: [],
        expected_metrics: [],
        expected_constraints: [],
        expected_vocabulary: [],
        suspicious_vocabulary: ["MVP", "GTM", "ICP", "CAC", "LTV"],
        forbidden_template_patterns: ["startup jargon"]
      };
    }
  }
}
