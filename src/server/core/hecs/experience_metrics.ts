import { ExperienceMetrics } from './experience_types.js';
import { ExperienceStore } from './experience_store.js';

export class ExperienceMetricsTracker {
    static getMetrics(): ExperienceMetrics {
        const experiences = ExperienceStore.getAll();
        const total = experiences.length;
        
        if (total === 0) {
            return {
                total_experiences: 0,
                successful_experiences: 0,
                failed_experiences: 0,
                average_confidence: 0,
                average_success: 0,
                average_novelty: 0,
                transferability_score: 0,
                competence_coverage: 0
            };
        }
        
        const successful = experiences.filter(e => e.success_score >= 70).length;
        const failed = experiences.filter(e => e.success_score < 50).length;
        
        const avgConf = experiences.reduce((acc, e) => acc + e.confidence, 0) / total;
        const avgSuccess = experiences.reduce((acc, e) => acc + e.success_score, 0) / total;
        const avgNovelty = experiences.reduce((acc, e) => acc + e.novelty_score, 0) / total;
        
        const totalSkills = experiences.reduce((acc, e) => acc + e.transferable_skills.length, 0);
        const uniqueDomains = new Set(experiences.map(e => e.mission_domain)).size;
        
        return {
            total_experiences: total,
            successful_experiences: successful,
            failed_experiences: failed,
            average_confidence: avgConf,
            average_success: avgSuccess,
            average_novelty: avgNovelty,
            transferability_score: totalSkills / total,
            competence_coverage: uniqueDomains * 10
        };
    }
}
