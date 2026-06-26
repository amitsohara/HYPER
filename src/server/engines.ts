import { GoogleGenAI } from "@google/genai";
import { tokenBudgetStorage } from "./core/tokens/token_context.js";
import { globalPromptCache } from "./core/tokens/prompt_cache.js";
import { CostEstimator } from "./core/tokens/cost_estimator.js";

export async function generateWithRetry(ai: GoogleGenAI, config: any, retries: number = 3): Promise<any> {
    const budgetManager = tokenBudgetStorage.getStore();
    
    // Estimate tokens
    const promptStr = typeof config.contents === 'string' ? config.contents : JSON.stringify(config.contents);
    const estTokens = CostEstimator.estimateTokens(promptStr);

    if (budgetManager) {
        if (!budgetManager.canAfford(estTokens)) {
            console.warn(`Token budget exceeded! Mode: ${budgetManager.getMode()}`);
            throw new Error("Token budget exceeded.");
        }
    }

    const cached = globalPromptCache.get(promptStr);
    if (cached) {
        if (budgetManager) budgetManager.recordSavings(cached.estimatedTokens);
        return cached.response;
    }

    for (let i = 0; i < retries; i++) {
        try {
            const response = await ai.models.generateContent(config);
            // Rough estimation for completion
            const completionTokens = CostEstimator.estimateTokens(response?.text || "");
            if (budgetManager) {
                budgetManager.consumeTokens(estTokens + completionTokens);
            }
            
            globalPromptCache.set(promptStr, response, estTokens + completionTokens);
            
            return response;
        } catch (e: any) {
            console.warn(`Attempt ${i+1} failed for ${config.model}: ${e.message}`);
            if (i === retries - 1) throw e;
            
            if (e.message?.includes("429") || e.status === 429 || e.message?.includes("quota") || e.message?.includes("RESOURCE_EXHAUSTED") || e.status === "RESOURCE_EXHAUSTED") {
                let delay = 35000;
                const match = e.message?.match(/retry in ([\d\.]+)s/i);
                if (match && match[1]) {
                    delay = (parseFloat(match[1]) + 2) * 1000;
                }
                console.warn(`Rate limited on ${config.model}. Waiting ${delay}ms before retry...`);
                await new Promise(r => setTimeout(r, delay));
            } else {
                await new Promise(r => setTimeout(r, 2000 * Math.pow(2, i))); // Exponential Backoff
            }
        }
    }
}

export async function cleanJSON(text: string, ai: GoogleGenAI): Promise<any> {
    if (!text) return null;
    let t = text.trim();
    t = t.replace(/^```json/i, "").replace(/^```/, "").replace(/```$/, "").trim();
    
    try {
        return JSON.parse(t);
    } catch (e: any) {
        console.warn("JSON parsing failed, attempting repair via LLM...");
        const sysPrompt = "You are an expert JSON repair tool. Repair the following invalid JSON and return ONLY the fully corrected valid JSON without any markdown formatting or explanations. Error encountered: " + e.message + "\n\nRaw JSON:\n" + t;
        try {
            const repairRes = await generateWithRetry(ai, {
                model: 'gemini-flash-latest',
                contents: sysPrompt,
                config: { responseMimeType: "application/json" }
            }, 3);
            let rt = (repairRes?.text || "{}").trim();
            rt = rt.replace(/^```json/i, "").replace(/^```/, "").replace(/```$/, "").trim();
            return JSON.parse(rt);
        } catch (repairErr) {
            console.warn("JSON repair also failed:", repairErr);
            throw repairErr;
        }
    }
}

export class DynamicWorldGenerator {
  static async generate(ai: GoogleGenAI, mission: string, mode: string, memoryContext: string): Promise<string[]> {
    const prompt = `Generate exactly 10 diverse, distinct, and highly specific synthetic environments/worlds to test the following mission: "${mission}". 
Simulation Mode: ${mode}
Relevant Past Lessons (if any): ${memoryContext}
Return ONLY a JSON array of 10 strings.`;
    
    try {
      const response = await generateWithRetry(ai, {
        model: 'gemini-flash-latest',
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });
      const text = response.text || "[]";
      const result = await cleanJSON(text, ai);
      return Array.isArray(result) ? result : (result || []);
    } catch(e) {
      console.warn('DynamicWorldGenerator error:', e);
    }
    return [];
  }
}

export class AgentDebateEngine {
  static async run(ai: GoogleGenAI, mission: string, worlds: string[], mode: string, memoryContext: string, agents: any[]): Promise<any[]> {
    const prompt = `You are the AgentDebateEngine. Your team consists of the following agents:
${JSON.stringify(agents, null, 2)}

For the mission: "${mission}"
Simulation Mode: ${mode}
Relevant Past Lessons: ${memoryContext}
And the synthetic worlds: ${JSON.stringify(worlds)}

For EACH world, debate among the agents to construct a unique "scenario" or challenge, and a synthesized "solution".
Return ONLY a JSON array of objects, where each object has:
{
  "world": "Name of the world",
  "scenario": "The specific challenge in this world",
  "solution": "The best synthesized solution agreed upon by the agents",
  "debates": [ 
    { "agent": "Researcher", "argument": "..." },
    { "agent": "Pessimist", "argument": "..." }
  ]
}
Ensure all ${agents.length} agents (${agents.map(a => a.name).join(', ')}) are in the debates array for EVERY world. Ensure exactly ${worlds.length} objects are returned.`;

    try {
      const response = await generateWithRetry(ai, {
        model: 'gemini-flash-latest',
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });
      const text = response?.text || "[]";
      return await cleanJSON(text, ai) || [];
    } catch(e) {
      console.warn('AgentDebateEngine error:', e);
      return [];
    }
  }
}

export class CriticScoringEngine {
  static async scoreAll(ai: GoogleGenAI, scenarios: any[], mode: string, memoryContext: string): Promise<any[]> {
    if (!scenarios || scenarios.length === 0) return [];
    
    const prompt = `You are the CriticScoringEngine. Review the following ${scenarios.length} scenarios and solutions:
${JSON.stringify(scenarios.map((s, i) => ({ id: i, world: s.world, scenario: s.scenario, solution: s.solution })))}
Simulation Mode: ${mode}
Relevant Past Lessons: ${memoryContext}

Generate a detailed score evaluation for EACH scenario. Return ONLY a JSON array of objects, strictly in the same order as the input. Each object must have:
{
  "feasibility_score": number (0-100),
  "risk_score": number (0-100),
  "impact_score": number (0-100),
  "novelty_score": number (0-100),
  "confidence_score": number (0-100),
  "final_score": number (calculated average 0-100),
  "feedback": "Detailed critical feedback string"
}`;

    try {
       const response = await generateWithRetry(ai, {
        model: 'gemini-flash-latest',
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });
      const text = response?.text || "[]";
      return await cleanJSON(text, ai) || [];
    } catch(e) {
      console.warn('CriticScoringEngine error:', e);
      return [];
    }
  }
}

export class DiscoveryEngine {
  static async discover(ai: GoogleGenAI, mission: string, scenarios: any[], mode: string, memoryContext: string): Promise<any> {
    const prompt = `You are the DiscoveryEngine. Based on the mission "${mission}" and the rigorous agent debate scenarios:
${JSON.stringify(scenarios.map(s => s.solution))}

Simulation Mode: ${mode}
Relevant Past Lessons: ${memoryContext}

Synthesize these findings to discover new ideas, hypotheses, and experiments.
Return ONLY a JSON object with:
{
  "ideas": ["10 completely new ideas/inventions/strategies"],
  "hypotheses": ["5 testable hypotheses based on the ideas"],
  "experiments": ["5 concrete experiment designs to test the hypotheses"],
  "breakthrough_ranking": {
    "breakthrough_score": number (0-100),
    "novelty_score": number (0-100),
    "feasibility_score": number (0-100),
    "civilization_impact_score": number (0-100),
    "risk_score": number (0-100)
  }
}`;

    try {
      const response = await generateWithRetry(ai, {
        model: 'gemini-flash-latest',
        contents: prompt,
        config: { responseMimeType: "application/json" }
      }, 5);
      const text = response?.text || "{}";
      return await cleanJSON(text, ai);
    } catch(e) {
      console.warn('DiscoveryEngine error:', e);
      return {
        ideas: [], hypotheses: [], experiments: [], 
        breakthrough_ranking: { breakthrough_score: 0, novelty_score: 0, feasibility_score: 0, civilization_impact_score: 0, risk_score: 0 }
      };
    }
  }
}
