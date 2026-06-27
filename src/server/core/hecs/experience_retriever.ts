import { Experience } from './experience_types.js';
import { ExperienceStore } from './experience_store.js';

export class ExperienceRetriever {
    
    private static calculateSimilarity(text1: string, text2: string): number {
        const words1 = new Set(text1.toLowerCase().split(/\\W+/));
        const words2 = new Set(text2.toLowerCase().split(/\\W+/));
        let intersection = 0;
        words1.forEach(w => {
            if (words2.has(w) && w.length > 3) intersection++;
        });
        return intersection;
    }

    static retrieveForMission(mission: string, domain: string, limit: number = 20): Experience[] {
        const experiences = ExperienceStore.getAll();
        
        const scored = experiences.map(exp => {
            let score = 0;
            
            score += this.calculateSimilarity(exp.mission, mission) * 10;
            if (exp.mission_domain === domain) score += 20;
            score += exp.transferable_skills.length * 2;
            score += (exp.success_score / 10);
            score += (exp.confidence / 10);
            
            const ageDays = (Date.now() - exp.timestamp) / (1000 * 60 * 60 * 24);
            if (ageDays < 7) score += 5;
            
            return { exp, score };
        });
        
        scored.sort((a, b) => b.score - a.score);
        return scored.filter(s => s.score > 0).slice(0, limit).map(s => s.exp);
    }
}
