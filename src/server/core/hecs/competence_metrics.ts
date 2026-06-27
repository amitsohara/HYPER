import { CompetenceProfile } from './competence_profile.js';

export class CompetenceMetrics {
    static recalculateStrengthsAndWeaknesses(profile: CompetenceProfile) {
        profile.strengths = [];
        profile.weaknesses = [];
        
        const assess = (record: Record<string, number>, category: string) => {
            Object.entries(record).forEach(([key, score]) => {
                if (score >= 80) profile.strengths.push(`${category}: ${key}`);
                
                let count = 0;
                if (category === 'domain') count = profile.experience_counts.domains[key] || 0;
                else if (category === 'skill') count = profile.experience_counts.skills[key] || 0;
                else if (category === 'mission_type') count = profile.experience_counts.mission_types[key] || 0;
                else count = profile.experience_counts.total; // for cognitive

                if (score < 40 && count > 2) {
                     profile.weaknesses.push(`${category}: ${key}`);
                }
            });
        };
        
        assess(profile.domain_competence, 'domain');
        assess(profile.skill_competence, 'skill');
        assess(profile.cognitive_capability_competence, 'cognitive');
    }
}
