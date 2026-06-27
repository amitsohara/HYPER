import { GoogleGenAI } from "@google/genai";
import { ExperienceCluster } from "./experience_clusterer.js";
import { generateWithRetry, cleanJSON } from "../../engines.js";

export interface CommonStructure {
    common_problem_structure: string[];
    common_constraints: string[];
    common_actions: string[];
    common_decisions: string[];
    common_success_factors: string[];
    common_failure_factors: string[];
    common_evidence_needs: string[];
    common_risks: string[];
    common_stakeholder_patterns: string[];
}

export class CommonStructureExtractor {
    static async extract(ai: GoogleGenAI, cluster: ExperienceCluster): Promise<CommonStructure | null> {
        const prompt = `You are the HyperMind Common Structure Extractor.
Extract the common structural elements across these clustered experiences.

Cluster: ${cluster.cluster_name}
Domain: ${cluster.domain}
Experiences: ${JSON.stringify(cluster.experiences.map(e => ({
    mission: e.mission,
    lessons: e.lessons,
    mistakes: e.mistakes,
    success: e.success_score,
    patterns: e.reusable_patterns
})))}

Return a JSON object:
{
    "common_problem_structure": ["..."],
    "common_constraints": ["..."],
    "common_actions": ["..."],
    "common_decisions": ["..."],
    "common_success_factors": ["..."],
    "common_failure_factors": ["..."],
    "common_evidence_needs": ["..."],
    "common_risks": ["..."],
    "common_stakeholder_patterns": ["..."]
}`;
        try {
            const response = await generateWithRetry(ai, {
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: { responseMimeType: "application/json" }
            });
            let parsed = await cleanJSON(response?.text || "{}", ai);
            
            if (process.env.MODEL_MODE === 'dev_stub' && (!parsed.common_problem_structure || parsed.provider_used)) {
                parsed = {
                    common_problem_structure: ["Mock problem structure"],
                    common_constraints: ["Mock constraints"],
                    common_actions: ["Mock actions"],
                    common_decisions: ["Mock decisions"],
                    common_success_factors: ["Mock success factors"],
                    common_failure_factors: ["Mock failure factors"],
                    common_evidence_needs: ["Mock evidence needs"],
                    common_risks: ["Mock risks"],
                    common_stakeholder_patterns: ["Mock stakeholder patterns"]
                };
            }

            return {
                common_problem_structure: parsed.common_problem_structure || [],
                common_constraints: parsed.common_constraints || [],
                common_actions: parsed.common_actions || [],
                common_decisions: parsed.common_decisions || [],
                common_success_factors: parsed.common_success_factors || [],
                common_failure_factors: parsed.common_failure_factors || [],
                common_evidence_needs: parsed.common_evidence_needs || [],
                common_risks: parsed.common_risks || [],
                common_stakeholder_patterns: parsed.common_stakeholder_patterns || []
            };
        } catch (e) {
            console.error("[HKES] CommonStructureExtractor failed", e);
            return null;
        }
    }
}
