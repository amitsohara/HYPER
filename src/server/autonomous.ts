import { GoogleGenAI } from '@google/genai';
import { generateWithRetry, cleanJSON } from './engines.js';

export class AutonomousResearchEngine {
  static async identifyGapsAndFollowUps(ai: GoogleGenAI, missionData: any): Promise<any> {
    const prompt = `You are the Autonomous Research Lead. Analyze this completed mission / research report.
Data: ${JSON.stringify(missionData)}

Identify knowledge gaps, weak assumptions, and unanswered questions.
Then generate follow-up research questions to pursue next. 

Return EXACTLY a JSON object with:
{
  "weak_assumptions": ["List of weak assumptions made during the mission"],
  "unanswered_questions": ["List of questions raised but not answered"],
  "knowledge_gaps": ["List of fundamental knowledge gaps identified"],
  "follow_up_questions": [
    {
      "question": "A specific follow-up research mission prompt",
      "priority_score": number (0-100),
      "research_value_score": number (0-100)
    }
  ]
}`;
    try {
       const resp = await generateWithRetry(ai, {
           model: 'gemini-2.5-flash',
           contents: prompt,
           config: { responseMimeType: "application/json" }
       }, 3);
       return await cleanJSON(resp?.text || "{}", ai);
    } catch(e) {
       console.warn("identifying gaps error", e);
       return { weak_assumptions: [], unanswered_questions: [], knowledge_gaps: [], follow_up_questions: [] };
    }
  }
}
