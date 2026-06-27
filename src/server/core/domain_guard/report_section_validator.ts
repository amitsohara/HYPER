import { GoogleGenAI } from "@google/genai";
import { WrongDomainDetector } from "./wrong_domain_detector.js";
import { generateWithRetry, cleanJSON } from "../../engines.js";

export interface ValidationResult {
  section_name: string;
  domain_alignment_score: number;
  wrong_domain_terms: string[];
  mismatched_actions: string[];
  missing_domain_requirements: string[];
  repair_required: boolean;
}

export class ReportSectionValidator {
  static async validate(ai: GoogleGenAI, sectionName: string, sectionContent: any, profile: any): Promise<ValidationResult> {
    const basicDetection = WrongDomainDetector.detect(sectionName, sectionContent, profile);
    
    if (basicDetection.score < 100) {
        // We know it needs repair from basic keyword checks, but let's get AI to explain mismatched actions and missing requirements
        const prompt = `You are a Domain Alignment Validator.
Analyze this section of a report for domain alignment.
Section Name: ${sectionName}
Content: ${JSON.stringify(sectionContent)}
Domain Profile: ${JSON.stringify({ 
    primary_domain: profile.primary_domain, 
    expected_actions: profile.expected_actions, 
    expected_metrics: profile.expected_metrics 
})}

Identify mismatched actions (actions that belong to a different domain, e.g., startup actions in an engineering mission) and missing domain requirements.
Return JSON:
{
  "mismatched_actions": ["String"],
  "missing_domain_requirements": ["String"]
}`;
        try {
            const res = await generateWithRetry(ai, {
                model: "gemini-flash-lite-latest",
                contents: prompt,
                config: { responseMimeType: "application/json", temperature: 0.1 }
            });
            const analysis = await cleanJSON(res.text, ai);
            return {
                section_name: sectionName,
                domain_alignment_score: basicDetection.score,
                wrong_domain_terms: basicDetection.violations,
                mismatched_actions: analysis.mismatched_actions || [],
                missing_domain_requirements: analysis.missing_domain_requirements || [],
                repair_required: true
            };
        } catch (e) {
            return {
                section_name: sectionName,
                domain_alignment_score: basicDetection.score,
                wrong_domain_terms: basicDetection.violations,
                mismatched_actions: [],
                missing_domain_requirements: [],
                repair_required: true
            };
        }
    }
    
    return {
        section_name: sectionName,
        domain_alignment_score: 100,
        wrong_domain_terms: [],
        mismatched_actions: [],
        missing_domain_requirements: [],
        repair_required: false
    };
  }
}
