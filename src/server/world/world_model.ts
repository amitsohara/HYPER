import { GoogleGenAI } from '@google/genai';
import { generateWithRetry, cleanJSON } from '../engines.js';

// Global causal graph store (in-memory for preview)
let causalGraph: any[] = [];

export class WorldModelEngine {
    static async evolveFromEvidence(ai: GoogleGenAI, newEvidence: string) {
        const prompt = `You are the World Model Evolutionary Engine.
Current Causal Graph: ${JSON.stringify(causalGraph)}
New Evidence: "${newEvidence}"

Your task is to evolve the World Model. Review the new evidence against the current causal graph.
If the evidence contradicts a rule, reduce its confidence or remove it.
If the evidence supports a rule, increase its confidence.
If the evidence implies a new rule, add it.

Return the completely updated causal graph in this JSON format:
{
  "updated_causal_graph": [
    {
      "cause": "Specific action or condition",
      "effect": "Observed result",
      "confidence": 0.85,
      "context_dependencies": ["Condition 1"]
    }
  ],
  "evolution_summary": "Summary of what changed based on the new evidence."
}`;
        
        const res = await generateWithRetry(ai, {
            model: 'gemini-3.1-flash-lite',
            contents: prompt,
            config: { responseMimeType: "application/json" }
        }, 3);
        const data = await cleanJSON(res?.text || "{}", ai);
        
        if (data.updated_causal_graph) {
            causalGraph = data.updated_causal_graph;
        }
        
        return {
            causal_graph: causalGraph,
            evolution_summary: data.evolution_summary || "World model evolved from new evidence."
        };
    }

    static async updateCausalModel(ai: GoogleGenAI, action: string, outcome: string, context: string) {
        const prompt = `You are the World Model Engine. Learn causal relationships from this observation:
Action taken: ${action}
Observed Outcome: ${outcome}
Context: ${context}
Extract cause-and-effect rules.
Return JSON:
{
  "new_causal_rules": [
    {
      "cause": "Specific action or condition",
      "effect": "Observed result",
      "confidence": 0.8,
      "context_dependencies": ["Condition 1"]
    }
  ]
}`;
        const res = await generateWithRetry(ai, {
            model: 'gemini-3.1-flash-lite',
            contents: prompt,
            config: { responseMimeType: "application/json" }
        }, 3);
        const data = await cleanJSON(res?.text || "{}", ai);
        if (data.new_causal_rules) {
            causalGraph.push(...data.new_causal_rules);
        }
        return data.new_causal_rules || [];
    }

    static async simulateFuture(ai: GoogleGenAI, config: { domain: string, startYear: number, endYear: number, context: string }) {
        const enhancedContext = config.context + (causalGraph.length > 0 ? `\nKnown Causal Rules: ${JSON.stringify(causalGraph.slice(-5))}` : "");
        const prompt = `You are a Future World Simulator predicting from ${config.startYear} to ${config.endYear} in the domain of ${config.domain}.
Context: ${enhancedContext}
Generate a simulation result with probability ranges, synthetic population impact, and strategic recommendations.
Apply the Known Causal Rules to your predictions if relevant. Do NOT use hardcoded predictions. Base it on logical progression and the provided causal rules.
Output JSON format:
{
  "id": "sim_${Math.random().toString(36).substring(7)}",
  "domain": "${config.domain}",
  "timeline": [
    { "year": 2026, "event": "Event description", "probability": 0.8 }
  ],
  "trends": [
    { "year": 2026, "value": 45 },
    { "year": 2027, "value": 55 }
  ],
  "population_impact": {
    "economic_shift": "Description",
    "social_shift": "Description"
  },
  "predicted_outcomes": [
    { "scenario": "Optimistic", "description": "...", "probability": 0.3 },
    { "scenario": "Pessimistic", "description": "...", "probability": 0.2 },
    { "scenario": "Most Likely", "description": "...", "probability": 0.5 }
  ],
  "recommended_strategies": [
    "Strategy 1",
    "Strategy 2"
  ],
  "applied_causal_rules_count": ${causalGraph.length}
}`;

        const res = await generateWithRetry(ai, {
            model: 'gemini-3.1-flash-lite',
            contents: prompt,
            config: { responseMimeType: "application/json" }
        }, 3);

        const data = await cleanJSON(res?.text || "{}", ai);
        return data;
    }
    
    static getCausalGraph() {
        return causalGraph;
    }
}
