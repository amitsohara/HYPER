import { HECSSkill, HECSStrategy } from './experience_types.js';
import { StrategyLibrary } from './strategy_library.js';

export class SkillEvolutionEngine {
    static evolveSkills(newSkills: HECSSkill[]): void {
        for (const newSkill of newSkills) {
            const similar = StrategyLibrary.findSimilarSkills(newSkill.skill_name, newSkill.domain);
            if (similar.length > 0) {
                const existing = similar[0];
                // Merge logic
                existing.version += 1;
                existing.last_updated = Date.now();
                
                // Add new experience source
                newSkill.source_experience_ids.forEach(id => {
                    if (!existing.source_experience_ids.includes(id)) {
                        existing.source_experience_ids.push(id);
                    }
                });

                // Update moving averages
                existing.success_rate = (existing.success_rate + newSkill.success_rate) / 2;
                existing.confidence = (existing.confidence + newSkill.confidence) / 2;
                
                // Update trigger conditions & steps (Union without duplicates ideally, but for now simple append/dedupe)
                existing.trigger_conditions = Array.from(new Set([...existing.trigger_conditions, ...newSkill.trigger_conditions]));
                // We keep existing steps or could evolve them, here we assume version bump keeps existing core
                
                StrategyLibrary.storeSkill(existing);
            } else {
                StrategyLibrary.storeSkill(newSkill);
            }
        }
    }

    static evolveStrategies(newStrategies: HECSStrategy[]): void {
        for (const newStrat of newStrategies) {
            const similar = StrategyLibrary.findSimilarStrategies(newStrat.strategy_name, newStrat.domain);
            if (similar.length > 0) {
                const existing = similar[0];
                existing.version += 1;
                
                newStrat.source_experience_ids.forEach(id => {
                    if (!existing.source_experience_ids.includes(id)) {
                        existing.source_experience_ids.push(id);
                    }
                });

                existing.success_rate = (existing.success_rate + newStrat.success_rate) / 2;
                existing.confidence = (existing.confidence + newStrat.confidence) / 2;
                
                existing.mission_types = Array.from(new Set([...existing.mission_types, ...newStrat.mission_types]));
                existing.required_capabilities = Array.from(new Set([...existing.required_capabilities, ...newStrat.required_capabilities]));
                existing.known_risks = Array.from(new Set([...existing.known_risks, ...newStrat.known_risks]));
                existing.best_for = Array.from(new Set([...existing.best_for, ...newStrat.best_for]));
                existing.avoid_when = Array.from(new Set([...existing.avoid_when, ...newStrat.avoid_when]));

                StrategyLibrary.storeStrategy(existing);
            } else {
                StrategyLibrary.storeStrategy(newStrat);
            }
        }
    }
}
