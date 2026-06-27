import { Experience } from './experience_types.js';
import { CompetenceProfileManager, CompetenceProfile } from './competence_profile.js';
import { SkillRegistry } from './skill_registry.js';
import { CompetenceMetrics } from './competence_metrics.js';

export class CompetenceTracker {
    static updateFromExperience(experience: Experience) {
        if (!experience || experience.quality_score === undefined || experience.quality_score < 40) {
            return; // Ignore low quality or incomplete experiences
        }

        const profile = CompetenceProfileManager.getProfile();
        const scoreDelta = this.calculateDelta(experience.quality_score);
        
        // 1. Domain
        const domain = experience.mission_domain.toLowerCase();
        this.updateScore(profile.domain_competence, domain, scoreDelta, profile, `Completed mission in ${domain} with quality ${experience.quality_score}`);
        this.incrementCount(profile.experience_counts.domains, domain);
        this.updateMovingAverage(profile, `domain_${domain}`, experience.quality_score);
        this.updateConfidence(profile, domain, experience.confidence);
        
        // 2. Mission Type
        const type = experience.mission_type.toLowerCase();
        this.updateScore(profile.mission_type_competence, type, scoreDelta, profile, `Completed mission type ${type}`);
        this.incrementCount(profile.experience_counts.mission_types, type);
        
        // 3. Skills
        experience.transferable_skills.forEach(skill => {
            const normalizedSkill = skill.toLowerCase();
            this.updateScore(profile.skill_competence, normalizedSkill, scoreDelta, profile, `Applied skill ${skill}`);
            this.incrementCount(profile.experience_counts.skills, normalizedSkill);
            SkillRegistry.registerSkill(normalizedSkill);
        });

        // 4. Cognitive Capabilities
        this.evaluateCognitiveCapabilities(experience, profile);

        // 5. Overall Updates
        profile.experience_counts.total++;
        profile.last_updated = Date.now();
        
        CompetenceMetrics.recalculateStrengthsAndWeaknesses(profile);
    }
    
    private static evaluateCognitiveCapabilities(experience: Experience, profile: CompetenceProfile) {
        let domainAlignDelta = 0;
        let evidenceDelta = 0;
        
        if (experience.mistakes && experience.mistakes.some(m => m.toLowerCase().includes("domain") || m.toLowerCase().includes("leakage"))) {
            domainAlignDelta = -5;
        } else if (experience.quality_score && experience.quality_score > 80) {
            domainAlignDelta = 1;
        }
        
        if (experience.mistakes && experience.mistakes.some(m => m.toLowerCase().includes("evidence"))) {
            evidenceDelta = -5;
        } else if (experience.quality_score && experience.quality_score > 80) {
            evidenceDelta = 2;
        }
        
        if (domainAlignDelta !== 0) {
             this.updateScore(profile.cognitive_capability_competence, "domain_alignment", domainAlignDelta, profile, `Domain alignment issue/success detected`);
        }
        if (evidenceDelta !== 0) {
             this.updateScore(profile.cognitive_capability_competence, "evidence_use", evidenceDelta, profile, `Evidence use issue/success detected`);
        }
    }

    private static calculateDelta(qualityScore: number): number {
        if (qualityScore >= 90) return 5;
        if (qualityScore >= 80) return 2;
        if (qualityScore >= 70) return 1;
        if (qualityScore < 50) return -2;
        return 0; // 50-69 neutral
    }

    private static updateScore(record: Record<string, number>, key: string, delta: number, profile: CompetenceProfile, reason: string) {
        if (delta === 0) return;
        const current = record[key] || 0;
        const newScore = Math.max(0, Math.min(100, current + delta));
        record[key] = newScore;
        
        profile.change_log.push({
            timestamp: Date.now(),
            entity: key,
            change: delta,
            reason: reason
        });
        
        if (profile.change_log.length > 1000) profile.change_log.shift();
    }

    private static incrementCount(record: Record<string, number>, key: string) {
        record[key] = (record[key] || 0) + 1;
    }

    private static updateMovingAverage(profile: CompetenceProfile, key: string, value: number) {
        if (!profile.improvement_trends[key]) {
            profile.improvement_trends[key] = [];
        }
        profile.improvement_trends[key].push(value);
        if (profile.improvement_trends[key].length > 10) {
            profile.improvement_trends[key].shift();
        }
    }

    private static updateConfidence(profile: CompetenceProfile, domain: string, confidence: number) {
        const current = profile.confidence_by_domain[domain];
        if (current === undefined) {
             profile.confidence_by_domain[domain] = confidence;
        } else {
             profile.confidence_by_domain[domain] = (current + confidence) / 2; // Simple moving average
        }
    }
}
