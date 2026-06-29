import { GoogleGenAI } from "@google/genai";
import { tokenBudgetStorage } from "./core/tokens/token_context.js";
import { globalPromptCache } from "./core/tokens/prompt_cache.js";
import { CostEstimator } from "./core/tokens/cost_estimator.js";

export async function generateWithRetry(ai: GoogleGenAI, config: any, retries: number = 6): Promise<any> {
    if (process.env.MODEL_MODE === "dev_stub") {
        await new Promise(r => setTimeout(r, 100)); // Simulate latency
        const promptStr = typeof config.contents === 'string' ? config.contents : JSON.stringify(config.contents);
        const isJSON = config.config?.responseMimeType === "application/json" || promptStr.includes("JSON") || promptStr.includes("{");
        
        let stubResponse = "{}";
        
        if (isJSON) {
            if (promptStr.includes("mission_type")) {
                stubResponse = JSON.stringify({
                    understanding: { mission_type: "general", complexity: 5, primary_objective: "Dev stub test mission", key_constraints: [], domain_knowledge_required: [] },
                    suggested_modules: ["social_cognition", "action_plan"]
                });
            } else if (promptStr.includes("social_risks")) {
                stubResponse = JSON.stringify({
                    intent_analysis: "Simulated social intent",
                    stakeholder_map: [{ name: "User", role: "Primary", interest: "High" }],
                    social_risks: ["Miscommunication", "Bias"],
                    interaction_strategy: "Clear communication"
                });
            } else if (promptStr.includes("evidence") && promptStr.includes("relevance_score")) {
                stubResponse = JSON.stringify([
                    { topic: "DevStub", fact: "Simulated fact 1", relevance_score: 95, confidence_score: 90, credibility_score: 85, source: "mock" }
                ]);
            } else if (promptStr.includes("evidence")) {
                stubResponse = JSON.stringify({
                    evidence: [{ topic: "test", fact: "simulated fact", confidence: 90, source: "stub" }]
                });
            } else if (promptStr.includes("reflection_summary")) {
                stubResponse = JSON.stringify({
                    reflection_summary: "Simulated reflection (dev_stub), keeping all modules.",
                    missing_capabilities: [],
                    overused_modules: [],
                    efficiency_suggestions: "None",
                    final_additions: [],
                    final_removals: []
                });
            } else if (promptStr.includes("executive_summary")) {
                 stubResponse = JSON.stringify({
                     executive_summary: "Dev stub summary",
                     key_takeaways: ["Simulated takeaway 1"],
                     strategic_alignment: "High alignment"
                 });
            } else if (promptStr.includes("premise_type")) {
                stubResponse = JSON.stringify({
                    premise_type: "hypothetical", clarity_score: 90, contradictions: [], missing_assumptions: [], required_reframing: "None", possible_interpretations: [], confidence: 95
                });
            } else if (promptStr.includes("world_name")) {
                stubResponse = JSON.stringify({
                    world_name: "Stub World", environment: "Simulated", entities: [], rules: [], constraints: [], resources: [], actors: [], systems: [], timeline: "Now", unknowns: []
                });
            } else if (promptStr.includes("perspective_role")) {
                stubResponse = JSON.stringify([{
                    perspective_role: "Stub Role", observations: [], needs: [], risks: [], opportunities: [], actions: [], conflicts: []
                }]);
            } else if (promptStr.includes("what_if")) {
                stubResponse = JSON.stringify([{
                    what_if: "What if stub?", changed_variable: "stub", immediate_effect: "none", downstream_impact: "none", mitigation: "none"
                }]);
            } else if (promptStr.includes("nodes") && promptStr.includes("edges")) {
                stubResponse = JSON.stringify({
                    nodes: [{ id: "n1", type: "object", label: "stub node" }],
                    edges: []
                });
            } else if (promptStr.includes("feasible_paths")) {
                stubResponse = JSON.stringify({
                    feasible_paths: ["stub path"], impossible_paths: [], unknown_paths: [], high_risk_high_reward_paths: [], safest_paths: []
                });
            } else if (promptStr.includes("best_explanation")) {
                stubResponse = JSON.stringify({
                    best_explanation: "Stub explanation", alternative_explanations: [], assumptions: [], reasoning_summary: "stub", confidence: 90, uncertainty: "low", evidence_needed: [], next_experiments: []
                });
            } else {
                 stubResponse = JSON.stringify({ 
                    provider_used: "dev_stub", 
                    is_real_ai_output: false,
                    simulated: true,
                    status: "success",
                    dummy_data: "This is a generic stub response"
                 });
            }
        } else {
            if (promptStr.includes("HTML") || promptStr.includes("Compiler") || promptStr.includes("Report")) {
                stubResponse = `<div class="p-4 bg-yellow-100 text-yellow-900 border border-yellow-400 rounded-md mb-4"><strong>Development Stub Mode:</strong> results are simulated, not real AI output.</div>
                <h1>Simulated Mission Report</h1>
                <p>Provider Used: dev_stub</p>
                <p>Is Real AI Output: false</p>
                <p>This is a generated stub report for development purposes.</p>
                <h2>Results</h2>
                <p>All pipeline stages executed successfully in offline mode.</p>`;
            } else {
                stubResponse = "Development Stub Mode: results are simulated, not real AI output.\nprovider_used: dev_stub\nis_real_ai_output: false";
            }
        }
        
        return { text: stubResponse };
    }

    if (!ai) throw new Error("GoogleGenAI instance is null but MODEL_MODE is not dev_stub");

    const budgetManager = tokenBudgetStorage.getStore();
    
    // Estimate tokens
    const promptStr = typeof config.contents === 'string' ? config.contents : JSON.stringify(config.contents);
    const estTokens = CostEstimator.estimateTokens(promptStr);

    if (budgetManager && !config.bypassBudget) {
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

    if (process.env.MODEL_MODE === "ollama") {
        const ollamaUrl = process.env.OLLAMA_URL || "http://127.0.0.1:11434";
        const ollamaModel = process.env.OLLAMA_MODEL || "llama3";
        const isJSON = config.config?.responseMimeType === "application/json";
        
        try {
            console.log(`Querying Ollama: ${ollamaUrl} (model: ${ollamaModel})`);
            const response = await fetch(`${ollamaUrl}/api/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: ollamaModel,
                    prompt: promptStr,
                    stream: false,
                    format: isJSON ? "json" : undefined
                })
            });

            if (!response.ok) {
                throw new Error(`Ollama API error: ${response.statusText}`);
            }

            const data = await response.json();
            const ollamaRes = { text: data.response };
            
            const completionTokens = CostEstimator.estimateTokens(ollamaRes.text);
            if (budgetManager) {
                budgetManager.consumeTokens(estTokens + completionTokens);
            }
            globalPromptCache.set(promptStr, ollamaRes, estTokens + completionTokens);
            
            return ollamaRes;
        } catch (e: any) {
            console.error(`Ollama generation failed: ${e.message}`);
            throw e;
        }
    }

    const fallbackChain = [
        'gemini-2.5-flash',
        'gemini-2.0-flash',
        'gemini-2.5-flash-lite',
        'gemini-2.0-flash-lite',
        'gemini-flash-lite-latest',
        'gemini-2.5-flash',
        'gemini-2.0-flash'
    ];
    let fallbackIndex = fallbackChain.indexOf(config.model);
    if (fallbackIndex === -1) fallbackIndex = 0;

    let attemptCount = 0;
    const maxAttempts = retries + fallbackChain.length * 3; // Give enough attempts to wait out rate limits

    while (attemptCount < maxAttempts) {
        attemptCount++;
        try {
            const response = await ai.models.generateContent(config);
            // Rough estimation for completion
            const completionTokens = CostEstimator.estimateTokens(response?.text || "");
            if (budgetManager) {
                budgetManager.consumeTokens(estTokens + completionTokens);
            }
            
            globalPromptCache.set(promptStr, response, estTokens + completionTokens);
            
            // Sleep to avoid rate limiting
            await new Promise(r => setTimeout(r, 2000));

            return response;
        } catch (e: any) {
            console.warn(`Attempt ${attemptCount} failed for ${config.model}: ${e.message}`);
            
            const isRateLimit = e.message?.includes("429") || e.status === 429 || e.message?.includes("quota") || e.message?.includes("RESOURCE_EXHAUSTED") || e.status === "RESOURCE_EXHAUSTED";
            const isUnavailable = e.message?.includes("503") || e.status === 503 || e.message?.includes("UNAVAILABLE") || e.status === "UNAVAILABLE";
            const isNotFound = e.message?.includes("404") || e.status === 404 || e.message?.includes("NOT_FOUND") || e.status === "NOT_FOUND";

            if (isRateLimit || isUnavailable || isNotFound) {
                let delay = isUnavailable ? 5000 : 35000;
                if (isNotFound) delay = 1000;

                const match = typeof e.message === 'string' ? e.message.match(/retry in ([\d\.]+)s/i) : null;
                if (match && match[1]) {
                    delay = (parseFloat(match[1]) + 2) * 1000;
                } else {
                    const match2 = String(e).match(/retry in ([\d\.]+)s/i);
                    if (match2 && match2[1]) {
                        delay = (parseFloat(match2[1]) + 2) * 1000;
                    }
                }
                
                if (isNotFound) {
                    if (fallbackIndex < fallbackChain.length - 1) {
                        fallbackIndex++;
                        config.model = fallbackChain[fallbackIndex];
                        console.warn(`Model not found. Falling back to ${config.model}`);
                        await new Promise(r => setTimeout(r, 1000));
                        continue;
                    } else {
                        throw new Error(`All fallback models exhausted due to Not Found errors.`);
                    }
                }

                // Fallback models to bypass quota issues
                if ((isRateLimit || isUnavailable) && fallbackIndex < fallbackChain.length - 1) {
                    fallbackIndex++;
                    config.model = fallbackChain[fallbackIndex];
                    if (delay > 20000) delay = 2000; // Small delay before switching model
                    console.warn(`Falling back to ${config.model}`);
                } else if (attemptCount >= maxAttempts || (!isRateLimit && !isUnavailable && !isNotFound)) {
                    throw e;
                }

                console.warn(`${isNotFound ? 'Not Found' : 'Rate limited or Unavailable'}. Waiting ${delay}ms before retry...`);
                await new Promise(r => setTimeout(r, delay));
            } else {
                if (attemptCount >= maxAttempts) throw e;
                await new Promise(r => setTimeout(r, 2000 * Math.pow(2, attemptCount - 1))); // Exponential Backoff
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
                model: 'gemini-2.5-flash',
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

CRITICAL: If the mission is about business, startups, software, or technology, the "worlds" MUST BE REALISTIC BUSINESS SCENARIOS (e.g. "B2B SaaS in economic downturn", "Consumer app in highly competitive market", "Hardware startup with supply chain issues"). DO NOT generate sci-fi worlds like Mars colonies or post-collapse cities unless the mission explicitly requests sci-fi.

Return ONLY a JSON array of 10 strings.`;
    
    try {
      const response = await generateWithRetry(ai, {
        model: 'gemini-2.5-flash',
        contents: prompt,
        bypassBudget: true,
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
        model: 'gemini-2.5-flash',
        contents: prompt,
        bypassBudget: true,
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
        model: 'gemini-2.5-flash',
        contents: prompt,
        bypassBudget: true,
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
        model: 'gemini-2.5-flash',
        contents: prompt,
        bypassBudget: true,
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
