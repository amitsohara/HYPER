import { Experience } from './experience_types.js';

export class ExperienceStore {
    private static experiences: Map<string, Experience> = new Map();

    static storeExperience(experience: Experience): void {
        this.experiences.set(experience.experience_id, experience);
    }

    static updateExperience(experience: Experience): void {
        if (this.experiences.has(experience.experience_id)) {
            this.experiences.set(experience.experience_id, experience);
        }
    }

    static deleteExperience(id: string): void {
        this.experiences.delete(id);
    }

    static retrieveExperience(id: string): Experience | undefined {
        return this.experiences.get(id);
    }

    static getAll(): Experience[] {
        return Array.from(this.experiences.values());
    }

    static searchExperience(query: string): Experience[] {
        return this.getAll().filter(e => e.mission.toLowerCase().includes(query.toLowerCase()));
    }

    static searchByDomain(domain: string): Experience[] {
        return this.getAll().filter(e => e.mission_domain === domain);
    }

    static searchByMissionType(type: string): Experience[] {
        return this.getAll().filter(e => e.mission_type === type);
    }

    static searchByTags(tags: string[]): Experience[] {
        return this.getAll().filter(e => e.domain_tags.some(tag => tags.includes(tag)));
    }

    static searchBySimilarity(mission: string): Experience[] {
        return this.getAll().filter(e => e.mission.toLowerCase().includes(mission.toLowerCase().split(' ')[0] || ""));
    }

    static searchRecent(limit: number = 10): Experience[] {
        return this.getAll().sort((a, b) => b.timestamp - a.timestamp).slice(0, limit);
    }

    static searchSuccessful(): Experience[] {
        return this.getAll().filter(e => e.success_score >= 80);
    }

    static searchFailed(): Experience[] {
        return this.getAll().filter(e => e.success_score < 50);
    }
}
