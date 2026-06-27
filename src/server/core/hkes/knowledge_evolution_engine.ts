import { GoogleGenAI } from "@google/genai";
import { ExperienceStore } from "../hecs/experience_store.js";
import { AbstractionStore } from "./abstraction_store.js";
import { Abstraction, AbstractionType } from "./abstraction_types.js";
import { generateWithRetry, cleanJSON } from "../../engines.js";

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export class KnowledgeEvolutionEngine {
    static async evolve(ai: GoogleGenAI): Promise<Abstraction[]> {
        // 1. Get recent or unclustered experiences. For simplicity, get all high-quality
        const allExperiences = ExperienceStore.getAll().filter(e => e.quality_score && e.quality_score >= 70);
        
        // Need at least 3 high quality experiences to even attempt abstraction (or we can group them by domain)
        if (allExperiences.length < 3) return [];

        const prompt = `You are the HyperMind Knowledge Evolution Engine (HKES).
Identify recurring abstractions across these mission experiences.
Only create abstractions if supported by at least 3 experiences.
Types: LESSON, PATTERN, SKILL, STRATEGY, PRINCIPLE, MENTAL_MODEL, CONCEPT.

Experiences:
${JSON.stringify(allExperiences.map(e => ({ id: e.experience_id, domain: e.mission_domain, mission: e.mission, patterns: e.reusable_patterns, lessons: e.lessons })))}

Return a valid JSON array of abstractions:
[{
    "abstraction_type": "CONCEPT",
    "title": "string",
    "description": "string",
    "source_experience_ids": ["id1", "id2", "id3"],
    "source_domains": ["domain1", "domain2"],
    "confidence": 85,
    "support_count": 3,
    "contradiction_count": 0,
    "transferability": 90,
    "evidence_strength": 80
}]`;

        try {
            const response = await generateWithRetry(ai, {
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: { responseMimeType: "application/json" }
            });
            let parsed = await cleanJSON(response?.text || "[]", ai);
            
            if (process.env.MODEL_MODE === 'dev_stub' && (!Array.isArray(parsed) || parsed.length === 0 || (parsed[0] && parsed[0].provider_used))) {
                 // Mock behavior based on input domains
                 const domains = new Set(allExperiences.map(e => e.mission_domain.toLowerCase()));
                 if (domains.has("aerospace") && allExperiences.length >= 3) {
                     parsed = [{
                         abstraction_type: AbstractionType.PATTERN,
                         title: "Mock Aerospace Settlement Pattern",
                         description: "Mock desc",
                         source_experience_ids: allExperiences.map(e => e.experience_id).slice(0, 3),
                         source_domains: ["Aerospace"],
                         confidence: 90,
                         support_count: 3,
                         contradiction_count: 0,
                         transferability: 85,
                         evidence_strength: 90
                     }];
                 } else if (domains.has("business") && allExperiences.length >= 3) {
                     parsed = [{
                         abstraction_type: AbstractionType.STRATEGY,
                         title: "Mock Startup Strategy",
                         description: "Mock desc",
                         source_experience_ids: allExperiences.map(e => e.experience_id).slice(0, 3),
                         source_domains: ["Business"],
                         confidence: 90,
                         support_count: 3,
                         contradiction_count: 0,
                         transferability: 85,
                         evidence_strength: 90
                     }];
                 } else {
                     parsed = [];
                 }
            }

            const newAbstractions: Abstraction[] = [];

            for (const item of parsed) {
                if (item.support_count >= 3 && item.confidence >= 60) {
                    const abstraction: Abstraction = {
                        abstraction_id: uuidv4(),
                        abstraction_type: item.abstraction_type as AbstractionType,
                        title: item.title,
                        description: item.description,
                        source_experience_ids: item.source_experience_ids || [],
                        source_domains: item.source_domains || [],
                        confidence: item.confidence,
                        support_count: item.support_count,
                        contradiction_count: item.contradiction_count || 0,
                        transferability: item.transferability || 50,
                        evidence_strength: item.evidence_strength || 50,
                        created_at: Date.now(),
                        updated_at: Date.now(),
                        version: 1
                    };
                    
                    // Check if similar exists (for simplicity, we just store it or dedupe by title)
                    const existing = AbstractionStore.getAll().find(a => a.title.toLowerCase() === abstraction.title.toLowerCase());
                    if (existing) {
                        existing.support_count = Math.max(existing.support_count, abstraction.support_count);
                        existing.source_experience_ids = Array.from(new Set([...existing.source_experience_ids, ...abstraction.source_experience_ids]));
                        existing.source_domains = Array.from(new Set([...existing.source_domains, ...abstraction.source_domains]));
                        AbstractionStore.updateAbstraction(existing);
                        newAbstractions.push(existing);
                    } else {
                        AbstractionStore.storeAbstraction(abstraction);
                        newAbstractions.push(abstraction);
                    }
                }
            }
            return newAbstractions;
        } catch(e) {
            console.error("[HKES] Failed to evolve knowledge", e);
            return [];
        }
    }
}
