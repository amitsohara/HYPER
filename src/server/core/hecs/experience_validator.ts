import { Experience } from './experience_types.js';
import { ExperienceStore } from './experience_store.js';

export class ExperienceValidator {
    static validate(experience: Experience, cycleStatus?: string, report?: any): { valid: boolean; reason?: string } {
        if (!experience.experience_id || !experience.mission_id) {
            return { valid: false, reason: "Incomplete ID fields" };
        }
        
        if (ExperienceStore.retrieveExperience(experience.experience_id)) {
            return { valid: false, reason: "Duplicate experience ID" };
        }
        
        if (experience.confidence < 0 || experience.success_score < 0) {
             return { valid: false, reason: "Corrupted scores" };
        }
        
        if (experience.confidence < 20) {
             return { valid: false, reason: "Confidence below threshold" };
        }

        if (experience.quality_score !== undefined && experience.quality_score < 40) {
            return { valid: false, reason: "Quality score below 40" };
        }

        if (cycleStatus === "failed") {
            return { valid: false, reason: "Cycle failed completely" };
        }

        const reportEmpty = !report || (typeof report === 'string' && report.trim() === '') || (typeof report === 'object' && Object.keys(report).length === 0);
        if (reportEmpty) {
            return { valid: false, reason: "Mission report is empty" };
        }

        if (!experience.lessons || experience.lessons.length === 0) {
            return { valid: false, reason: "No useful lesson exists" };
        }
        
        if (experience.mission_type === "dev_stub" || experience.mission.toLowerCase().includes("stub") || experience.mission_type === "dev_stub_test") {
             return { valid: false, reason: "Developer test stub rejected" };
        }
        
        return { valid: true };
    }
}

