import { GoogleGenAI } from '@google/genai';
import { generateWithRetry, cleanJSON } from '../engines.js';
import { PersistentBrain } from '../brain/persistent_brain.js';

export class SocietyManager {
    static async runCollective(ai: GoogleGenAI, mission_text: string) {
        try {
            console.log("Initializing Collective Intelligence (1000 Specialists)...");
            
            const prompt = `You are a Collective Intelligence Engine managing a society of 1000 specialists (Physicists, Economists, Doctors, Teachers, Lawyers, Engineers, Entrepreneurs, Urban Planners, Roboticists, Psychologists, Historians, Climate Scientists, etc.).

Mission: "${mission_text}"

Process flow:
1. Create specialized Teams based on the mission.
2. Simulate a Debate among the 1000 specialists.
3. Merge Knowledge from all disciplines.
4. Reach a Consensus.
5. Generate a Minority Report for dissenting views.
6. Make a Final Decision.

Return JSON:
{
  "teams_created": [
    {
      "name": "Team Name",
      "specialists": ["Expert 1", "Expert 2"],
      "expertise": "Domain focus",
      "confidence": 85
    }
  ],
  "debate_highlights": ["Point 1", "Point 2"],
  "merged_knowledge": ["Insight 1", "Insight 2"],
  "consensus": "Summary of what the majority agreed upon.",
  "minority_report": "The dissenting opinion from a subset of specialists.",
  "final_decision": "The ultimate conclusion or action plan."
}`;

            const res = await generateWithRetry(ai, {
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: { responseMimeType: "application/json" }
            });

            const data = await cleanJSON(res?.text || "{}", ai);

            const result = {
                teams_created: data.teams_created || [],
                debate_highlights: data.debate_highlights || [],
                merged_knowledge: data.merged_knowledge || [],
                consensus: data.consensus || "No consensus reached.",
                minority_report: data.minority_report || "No dissenting views.",
                final_decision: data.final_decision || "No decision made."
            };

            await PersistentBrain.storeEpisodicMemory({
                timestamp: new Date().toISOString(),
                type: "collective_intelligence_decision",
                content: `Collective Intelligence reached decision on mission. Consensus: ${result.consensus.substring(0, 100)}... Minority Report: ${result.minority_report.substring(0, 100)}...`
            });

            return result;

        } catch (e) {
            console.warn("Society Manager Error:", e);
            return {
                teams_created: [],
                debate_highlights: [],
                merged_knowledge: [],
                consensus: "Error forming consensus.",
                minority_report: "Error generating minority report.",
                final_decision: "Error reaching final decision."
            };
        }
    }
}
