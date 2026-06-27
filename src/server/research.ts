import { GoogleGenAI } from '@google/genai';
import { generateWithRetry, cleanJSON } from './engines.js';

export class ResearchEngine {
  static async planResearch(ai: GoogleGenAI, mission: string, memoryContext: string, kgContext: string): Promise<any> {
    const prompt = `You are an elite AI Research Scientist. Plan a research initiative for the mission: "${mission}".
Context from Memory: ${memoryContext}
Context from Knowledge Graph: ${kgContext}

Return EXACTLY a JSON object with:
{
  "research_questions": ["10 deep research questions"],
  "hypotheses": [
    {
      "hypothesis": "Strong, testable hypothesis statement",
      "evidence_required": "What evidence is needed to prove/disprove this",
      "experiment_design": "How to test this hypothesis in a synthetic environment"
    }
  ] // Exactly 5 hypotheses objects
}`;
    try {
      const response = await generateWithRetry(ai, {
        model: 'gemini-1.5-flash',
        contents: prompt,
        config: { responseMimeType: "application/json" }
      }, 3);
      return await cleanJSON(response?.text || "{}", ai);
    } catch (e) {
      console.warn("ResearchEngine planResearch error:", e);
      return { research_questions: [], hypotheses: [] };
    }
  }

  static async generateReport(ai: GoogleGenAI, mission: string, plan: any, debates: any[], discovery: any): Promise<any> {
    const prompt = `You are an elite AI Research Scientist. Compile a final research report for the mission: "${mission}".

Research Plan: ${JSON.stringify(plan)}
Agent Debates: ${JSON.stringify(debates)}
Discoveries: ${JSON.stringify(discovery)}

Synthesize this data and return EXACTLY a JSON object with:
{
  "expected_results": "Summary of what the synthetic experiments imply will happen",
  "possible_failure_points": ["List of potential failure points in the real world"],
  "ethical_concerns": ["List of ethical implications or risks"],
  "research_confidence_score": number (0-100, representing how robust the findings are),
  "final_research_report": "A comprehensive 3-4 paragraph essay summarizing the entire research endeavor, findings, and next steps."
}`;
    try {
      const response = await generateWithRetry(ai, {
        model: 'gemini-1.5-flash',
        contents: prompt,
        config: { responseMimeType: "application/json" }
      }, 3);
      return await cleanJSON(response?.text || "{}", ai);
    } catch (e) {
      console.error("ResearchEngine generateReport error:", e);
      return { 
        expected_results: "Error generating expected results", 
        possible_failure_points: [], 
        ethical_concerns: [], 
        research_confidence_score: 0, 
        final_research_report: "Error generating final report" 
      };
    }
  }
}
