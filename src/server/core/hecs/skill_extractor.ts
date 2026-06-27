import { GoogleGenAI } from "@google/genai";
import { generateWithRetry, cleanJSON } from "../../engines.js";
import { Experience, HECSSkill, HECSStrategy } from './experience_types.js';

export class SkillExtractor {
    static async extract(ai: GoogleGenAI, experience: Experience): Promise<{ skills: HECSSkill[], strategies: HECSStrategy[] }> {
        if (!experience.quality_score || experience.quality_score < 70) {
            return { skills: [], strategies: [] };
        }

        const prompt = `You are the HyperMind Skill Extractor.
Extract reusable skills and strategies from this high-quality mission experience.
Only extract clear, actionable, reusable methods. Do not duplicate concepts.

Mission: ${experience.mission}
Domain: ${experience.mission_domain}
Lessons: ${JSON.stringify(experience.lessons)}
Patterns: ${JSON.stringify(experience.reusable_patterns)}

Return a valid JSON object matching this structure:
{
  "skills": [
    {
      "skill_name": "string (actionable name)",
      "description": "string",
      "trigger_conditions": ["when to use this"],
      "steps": ["step 1", "step 2"]
    }
  ],
  "strategies": [
    {
      "strategy_name": "string (high-level approach)",
      "mission_types": ["suitable mission type"],
      "description": "string",
      "steps": ["phase 1", "phase 2"],
      "required_capabilities": ["what is needed"],
      "known_risks": ["risk 1"],
      "best_for": ["context"],
      "avoid_when": ["context"]
    }
  ]
}
`;

        try {
            const response = await generateWithRetry(ai, {
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: { responseMimeType: "application/json" }
            });
            let parsed = await cleanJSON(response?.text || "{}", ai);
            
            if (process.env.MODEL_MODE === 'dev_stub' && (!parsed.skills || parsed.provider_used)) {
                 parsed = {
                     skills: [{
                         skill_name: "Mock Skill",
                         description: "Mock description",
                         trigger_conditions: ["Mock trigger"],
                         steps: ["Mock step 1"]
                     }],
                     strategies: [{
                         strategy_name: "Mock Strategy",
                         mission_types: ["Mock Type"],
                         description: "Mock desc",
                         steps: ["Mock step 1"],
                         required_capabilities: ["Mock req"],
                         known_risks: ["Mock risk"],
                         best_for: ["Mock best"],
                         avoid_when: ["Mock avoid"]
                     }]
                 };
            }

            const now = Date.now();

            const skills: HECSSkill[] = (parsed.skills || []).map((s: any, idx: number) => ({
                skill_id: `sk_${experience.experience_id}_${idx}`,
                skill_name: s.skill_name || "Unknown Skill",
                domain: experience.mission_domain,
                description: s.description || "",
                trigger_conditions: s.trigger_conditions || [],
                steps: s.steps || [],
                source_experience_ids: [experience.experience_id],
                success_rate: experience.success_score || 50,
                confidence: experience.confidence || 50,
                version: 1,
                last_updated: now
            }));

            const strategies: HECSStrategy[] = (parsed.strategies || []).map((s: any, idx: number) => ({
                strategy_id: `st_${experience.experience_id}_${idx}`,
                strategy_name: s.strategy_name || "Unknown Strategy",
                domain: experience.mission_domain,
                mission_types: s.mission_types || [experience.mission_type],
                description: s.description || "",
                steps: s.steps || [],
                required_capabilities: s.required_capabilities || [],
                known_risks: s.known_risks || [],
                best_for: s.best_for || [],
                avoid_when: s.avoid_when || [],
                source_experience_ids: [experience.experience_id],
                success_rate: experience.success_score || 50,
                confidence: experience.confidence || 50,
                version: 1
            }));

            return { skills, strategies };
        } catch (e) {
            console.error("[HECS] SkillExtractor failed", e);
            return { skills: [], strategies: [] };
        }
    }
}
