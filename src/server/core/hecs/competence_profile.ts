export interface CompetenceProfile {
    domain_competence: Record<string, number>;
    mission_type_competence: Record<string, number>;
    skill_competence: Record<string, number>;
    cognitive_capability_competence: Record<string, number>;
    strengths: string[];
    weaknesses: string[];
    improvement_trends: Record<string, number[]>;
    confidence_by_domain: Record<string, number>;
    experience_counts: {
        domains: Record<string, number>;
        mission_types: Record<string, number>;
        skills: Record<string, number>;
        total: number;
    };
    last_updated: number;
    change_log: { timestamp: number; entity: string; change: number; reason: string }[];
}

export class CompetenceProfileManager {
    private static profile: CompetenceProfile = {
        domain_competence: {},
        mission_type_competence: {},
        skill_competence: {},
        cognitive_capability_competence: {
            "mission_understanding": 0,
            "imagination": 0,
            "reasoning": 0,
            "evidence_use": 0,
            "planning": 0,
            "decision_quality": 0,
            "domain_alignment": 0,
            "reflection": 0,
            "learning": 0,
            "uncertainty_handling": 0
        },
        strengths: [],
        weaknesses: [],
        improvement_trends: {},
        confidence_by_domain: {},
        experience_counts: { domains: {}, mission_types: {}, skills: {}, total: 0 },
        last_updated: Date.now(),
        change_log: []
    };

    static getProfile(): CompetenceProfile {
        return this.profile;
    }
}
