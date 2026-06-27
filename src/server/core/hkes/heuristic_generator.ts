import { GoogleGenAI } from "@google/genai";
import { PatternAbstraction, HeuristicAbstraction, AbstractionType } from "./abstraction_types.js";
import { generateWithRetry, cleanJSON } from "../../engines.js";

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export class HeuristicGenerator {
    static async generate(ai: GoogleGenAI, patterns: PatternAbstraction[]): Promise<HeuristicAbstraction[]> {
        if (patterns.length === 0) return [];
        
        const prompt = `You are the HyperMind Heuristic Generator.
Generate practical, rule-of-thumb heuristics (IF -> THEN format) from the provided patterns.
Each heuristic must be specific, actionable, and include 'avoid_when' and 'failure_warning' clauses.
Do NOT generate generic advice like "plan carefully".

Source Patterns:
${JSON.stringify(patterns.map(p => ({
    id: p.abstraction_id,
    title: p.title,
    description: p.description,
    category: p.pattern_category,
    conditions: p.recurring_conditions,
    actions: p.recurring_actions,
    domains: p.source_domains
})))}

Return a JSON array of generated heuristics:
[{
  "title": "Short title",
  "description": "Short description",
  "if_conditions": ["mission involves remote hostile environment", "supply chain latency is high"],
  "then_guidance": ["prioritize local resource production before population scaling"],
  "avoid_when": ["local resource availability is unverified"],
  "failure_warning": ["over-scaling population before resource closure may cause mission collapse"],
  "source_pattern_ids": ["pattern_id_1"],
  "applicable_domains": ["Aerospace", "Logistics"],
  "mission_types": ["Settlement", "Exploration"],
  "confidence": 85,
  "transferability": 80,
  "evidence_strength": 90
}]`;

        try {
            const response = await generateWithRetry(ai, {
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: { responseMimeType: "application/json" }
            });
            let parsed = await cleanJSON(response?.text || "[]", ai);
            
            if (process.env.MODEL_MODE === 'dev_stub' && (!Array.isArray(parsed) || parsed.length === 0 || parsed[0]?.provider_used)) {
                // Determine mock heuristics based on input patterns
                parsed = patterns.map(p => {
                    if (p.title.includes("Remote hostile settlements")) {
                        return {
                            title: "Prioritize local autonomy in remote settlements",
                            description: "When logistics are expensive or delayed, prioritize local production before scaling population.",
                            if_conditions: ["supply chains are expensive/delayed", "remote settlement"],
                            then_guidance: ["prioritize local resource production before population scaling"],
                            avoid_when: ["local resources are insufficient or unknown"],
                            failure_warning: ["scaling population too quickly leads to supply starvation"],
                            source_pattern_ids: [p.abstraction_id],
                            applicable_domains: ["Aerospace", "SpaceSettlement"],
                            mission_types: ["Settlement"],
                            confidence: 90,
                            transferability: 80,
                            evidence_strength: 90
                        };
                    } else if (p.title.includes("Undefined ICP")) {
                        return {
                            title: "Validate ICP before MVP planning",
                            description: "When customer segment is unclear, validate ICP before MVP/GTM planning.",
                            if_conditions: ["customer segment is unclear"],
                            then_guidance: ["validate ICP before MVP/GTM planning"],
                            avoid_when: ["you already have strong market validation"],
                            failure_warning: ["generic MVP planning wastes engineering resources"],
                            source_pattern_ids: [p.abstraction_id],
                            applicable_domains: ["Business", "Startup"],
                            mission_types: ["Startup"],
                            confidence: 90,
                            transferability: 85,
                            evidence_strength: 95
                        };
                    } else if (p.title.includes("generic")) {
                        return {
                             title: "Make a good plan",
                             description: "Always plan well.",
                             if_conditions: ["always"],
                             then_guidance: ["plan carefully"],
                             avoid_when: ["never"],
                             failure_warning: ["bad things happen"],
                             source_pattern_ids: [p.abstraction_id],
                             applicable_domains: ["General"],
                             mission_types: ["General"],
                             confidence: 50,
                             transferability: 90,
                             evidence_strength: 50
                        };
                    }
                    return null;
                }).filter(Boolean);
            }

            return (parsed || []).map((h: any) => {
                // Collect source_experience_ids from the referenced patterns
                const expIds = new Set<string>();
                for (const pid of (h.source_pattern_ids || [])) {
                    const pattern = patterns.find(p => p.abstraction_id === pid);
                    if (pattern) {
                        pattern.source_experience_ids.forEach(id => expIds.add(id));
                    }
                }
                
                return {
                    abstraction_id: uuidv4(),
                    abstraction_type: AbstractionType.HEURISTIC,
                    title: h.title || "Unknown Heuristic",
                    description: h.description || "",
                    if_conditions: h.if_conditions || [],
                    then_guidance: h.then_guidance || [],
                    avoid_when: h.avoid_when || [],
                    failure_warning: h.failure_warning || [],
                    source_pattern_ids: h.source_pattern_ids || [],
                    source_experience_ids: Array.from(expIds),
                    source_domains: patterns.filter(p => h.source_pattern_ids?.includes(p.abstraction_id)).flatMap(p => p.source_domains),
                    applicable_domains: h.applicable_domains || [],
                    mission_types: h.mission_types || [],
                    confidence: h.confidence || 50,
                    support_count: expIds.size,
                    contradiction_count: 0,
                    applicability_score: 0,
                    transferability: h.transferability || 50,
                    evidence_strength: h.evidence_strength || 50,
                    created_at: Date.now(),
                    updated_at: Date.now(),
                    version: 1
                };
            });
        } catch (e) {
            console.error("[HKES] HeuristicGenerator failed", e);
            return [];
        }
    }
}
