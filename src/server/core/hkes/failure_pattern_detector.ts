import { GoogleGenAI } from "@google/genai";
import { CommonStructure } from "./common_structure_extractor.js";
import { ExperienceCluster } from "./experience_clusterer.js";
import { PatternAbstraction, AbstractionType } from "./abstraction_types.js";
import { generateWithRetry, cleanJSON } from "../../engines.js";

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export class FailurePatternDetector {
    static async detect(ai: GoogleGenAI, cluster: ExperienceCluster, structure: CommonStructure): Promise<PatternAbstraction[]> {
        const prompt = `You are the HyperMind Failure Pattern Detector.
Detect recurring failure patterns from this common structure and experience cluster.

Domain: ${cluster.domain}
Structure: ${JSON.stringify(structure.common_failure_factors)}
Risks: ${JSON.stringify(structure.common_risks)}

Return a JSON array of failure patterns:
[{
  "title": "string",
  "description": "string",
  "pattern_category": "failure_pattern",
  "recurring_conditions": ["..."],
  "recurring_actions": ["..."],
  "recurring_outcomes": ["..."],
  "recurring_failures": ["..."],
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
                if (cluster.domain.toLowerCase().includes("business")) {
                    parsed = [{
                        title: "Undefined ICP causes generic MVP/GTM planning.",
                        description: "Generic MVP planning fails when ICP is undefined.",
                        pattern_category: "failure_pattern",
                        recurring_conditions: ["Business mission with unclear customer segment."],
                        recurring_actions: ["Generic MVP planning."],
                        recurring_outcomes: ["Roadmap becomes generic."],
                        recurring_failures: ["Undefined ICP"],
                        confidence: 90,
                        transferability: 85,
                        evidence_strength: 95
                    }];
                } else {
                    parsed = [];
                }
            }

            return (parsed || []).map((p: any) => ({
                abstraction_id: uuidv4(),
                abstraction_type: AbstractionType.PATTERN,
                title: p.title || "Unknown Pattern",
                description: p.description || "",
                pattern_category: p.pattern_category || "failure_pattern",
                source_experience_ids: cluster.experience_ids,
                source_domains: [cluster.domain],
                source_mission_types: cluster.mission_types,
                recurring_conditions: p.recurring_conditions || [],
                recurring_actions: p.recurring_actions || [],
                recurring_outcomes: p.recurring_outcomes || [],
                recurring_failures: p.recurring_failures || [],
                recurring_success_factors: [],
                confidence: p.confidence || 50,
                support_count: cluster.experience_ids.length,
                contradiction_count: 0,
                transferability: p.transferability || 50,
                evidence_strength: p.evidence_strength || 50,
                created_at: Date.now(),
                updated_at: Date.now(),
                version: 1
            }));
        } catch (e) {
            console.error("[HKES] FailurePatternDetector failed", e);
            return [];
        }
    }
}
