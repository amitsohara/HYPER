import { PatternAbstraction } from "./abstraction_types.js";
import { ExperienceStore } from "../hecs/experience_store.js";

export class PatternValidator {
    static validate(pattern: PatternAbstraction): boolean {
        // Minimum support_count: 3 experiences
        if (pattern.support_count < 3) return false;
        
        // Do not create pattern from one mission (checked by count)
        
        // Do not create pattern from low-quality experiences
        // (Handled by clustering only high quality, but we can verify)
        let hasLowQuality = false;
        for (const id of pattern.source_experience_ids) {
            const exp = ExperienceStore.retrieveExperience(id);
            if (!exp || !exp.quality_score || exp.quality_score < 70) {
                hasLowQuality = true;
                break;
            }
        }
        if (hasLowQuality) return false;

        // Reject pattern if contradiction_count > support_count / 2
        if (pattern.contradiction_count > pattern.support_count / 2) return false;
        
        // Every pattern must cite source experience IDs
        if (!pattern.source_experience_ids || pattern.source_experience_ids.length === 0) return false;

        // Every pattern must include confidence and evidence strength
        if (pattern.confidence === undefined || pattern.evidence_strength === undefined) return false;

        return true;
    }
}
