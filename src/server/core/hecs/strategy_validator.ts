import { HECSSkill, HECSStrategy } from './experience_types.js';

export class StrategyValidator {
    static validateSkill(skill: HECSSkill): boolean {
        if (!skill.skill_name || !skill.domain || skill.steps.length === 0) return false;
        if (skill.confidence < 50) return false;
        return true;
    }

    static validateStrategy(strategy: HECSStrategy): boolean {
        if (!strategy.strategy_name || !strategy.domain || strategy.steps.length === 0) return false;
        if (strategy.confidence < 50) return false; // Do not use low-confidence strategies
        return true;
    }
}
