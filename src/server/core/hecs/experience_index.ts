import { Experience } from './experience_types.js';
import { ExperienceStore } from './experience_store.js';

export class ExperienceIndex {
    static getIndexSummary() {
        const experiences = ExperienceStore.getAll();
        
        const domainIndex: Record<string, string[]> = {};
        const missionTypeIndex: Record<string, string[]> = {};
        
        experiences.forEach(e => {
            if (!domainIndex[e.mission_domain]) domainIndex[e.mission_domain] = [];
            domainIndex[e.mission_domain].push(e.experience_id);
            
            if (!missionTypeIndex[e.mission_type]) missionTypeIndex[e.mission_type] = [];
            missionTypeIndex[e.mission_type].push(e.experience_id);
        });

        return {
            domains: domainIndex,
            mission_types: missionTypeIndex,
            difficulty_distribution: experiences.map(e => e.mission_complexity),
            success_rate: experiences.filter(e => e.success_score >= 70).length / (experiences.length || 1),
            recency: experiences.sort((a, b) => b.timestamp - a.timestamp).map(e => e.experience_id),
            novelty_scores: experiences.map(e => e.novelty_score),
            confidence_distribution: experiences.map(e => e.confidence),
            transferability_scores: experiences.map(e => e.transferable_skills.length)
        };
    }
}
