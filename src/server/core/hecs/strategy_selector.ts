import { HECSSkill, HECSStrategy } from './experience_types.js';
import { StrategyLibrary } from './strategy_library.js';
import { ExperienceRetriever } from './experience_retriever.js';

export class StrategySelector {
    static select(missionPrompt: string, domain: string, analogyMode: boolean = false): { skills: HECSSkill[], strategies: HECSStrategy[] } {
        // Find related experiences first (simulated via domain and text match)
        const allSkills = StrategyLibrary.getAllSkills();
        const allStrategies = StrategyLibrary.getAllStrategies();

        const skills = allSkills.filter(s => {
            if (analogyMode) return true; // could apply across domains
            return s.domain.toLowerCase() === domain.toLowerCase();
        }).sort((a, b) => b.success_rate - a.success_rate).slice(0, 5);

        const strategies = allStrategies.filter(s => {
            if (analogyMode) return true;
            return s.domain.toLowerCase() === domain.toLowerCase();
        }).sort((a, b) => b.success_rate - a.success_rate).slice(0, 3);

        return { skills, strategies };
    }
}
