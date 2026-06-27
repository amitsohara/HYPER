import { ExperienceStore } from './experience_store.js';
import { Experience } from './experience_types.js';

export class CrossDomainRetriever {
    static retrieveCandidates(targetMission: string, targetDomain: string): Experience[] {
        // Retrieve all high-quality experiences not in the target domain
        const allExperiences = ExperienceStore.getAll();
        
        return allExperiences.filter(exp => 
            exp.mission_domain.toLowerCase() !== targetDomain.toLowerCase() &&
            exp.quality_score && exp.quality_score >= 80 &&
            exp.reusable_patterns && exp.reusable_patterns.length > 0
        );
    }
}
