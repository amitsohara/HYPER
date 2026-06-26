import { GoogleGenAI } from '@google/genai';
import { generateWithRetry, cleanJSON } from './engines.js';

export class EvolutionEngine {
    static async evaluateAgents(ai: GoogleGenAI, mission: string, debates: any[]): Promise<any[]> {
        const prompt = `You are the Agent Performance Evaluator. Evaluate these agents based on their arguments for the mission "${mission}".
Arguments: ${JSON.stringify(debates)}

Return exactly a JSON array of objects (one per agent). Each object MUST have:
{
  "agent_name": "Name of the agent",
  "output_quality_score": number (0-100),
  "reasoning_score": number (0-100),
  "usefulness_score": number (0-100),
  "weakness_detected": "string explaining what failed or lacked",
  "improvement_suggestion": "string suggesting how to fix"
}`;
        try {
            const response = await generateWithRetry(ai, {
                model: 'gemini-1.5-flash',
                contents: prompt,
                config: { responseMimeType: "application/json" }
            }, 3);
            const resText = response?.text || "[]";
            return await cleanJSON(resText, ai) || [];
        } catch (e) {
            console.warn("EvolutionEngine evaluate error:", e);
            return [];
        }
    }

    static async evolveAgentPrompts(ai: GoogleGenAI, agentStore: any, weakAgentsData: any[]): Promise<any> {
        const prompt = `You are the Prompt Optimizer. We need to evolve the system prompts for weak AI agents to improve their future performance.
Data: ${JSON.stringify(weakAgentsData, null, 2)}

Return exactly a JSON array of objects detailing the rewritten prompts for each weak agent. Each object MUST have:
{
  "agent_name": "Name of the agent",
  "new_prompt": "Revised, stronger constraint-based instruction prompt incorporating improvement suggestions",
  "reason_for_change": "Why this instruction set is more effective"
}`;
        try {
            const response = await generateWithRetry(ai, {
                model: 'gemini-1.5-flash',
                contents: prompt,
                config: { responseMimeType: "application/json" }
            }, 3);
            return await cleanJSON(response?.text || "[]", ai) || [];
        } catch (e) {
            console.error("EvolutionEngine evolve error:", e);
            return [];
        }
    }
}
