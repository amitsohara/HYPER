import { HECSSkill, HECSStrategy } from './experience_types.js';

export class StrategyLibrary {
    private static skills: Map<string, HECSSkill> = new Map();
    private static strategies: Map<string, HECSStrategy> = new Map();

    static storeSkill(skill: HECSSkill): void {
        this.skills.set(skill.skill_id, skill);
    }

    static getSkill(id: string): HECSSkill | undefined {
        return this.skills.get(id);
    }

    static getAllSkills(): HECSSkill[] {
        return Array.from(this.skills.values());
    }

    static storeStrategy(strategy: HECSStrategy): void {
        this.strategies.set(strategy.strategy_id, strategy);
    }

    static getStrategy(id: string): HECSStrategy | undefined {
        return this.strategies.get(id);
    }

    static getAllStrategies(): HECSStrategy[] {
        return Array.from(this.strategies.values());
    }

    static findSimilarSkills(name: string, domain: string): HECSSkill[] {
        const nameLower = name.toLowerCase();
        return this.getAllSkills().filter(s => 
            s.domain === domain && (s.skill_name.toLowerCase().includes(nameLower) || nameLower.includes(s.skill_name.toLowerCase()))
        );
    }

    static findSimilarStrategies(name: string, domain: string): HECSStrategy[] {
        const nameLower = name.toLowerCase();
        return this.getAllStrategies().filter(s => 
            s.domain === domain && (s.strategy_name.toLowerCase().includes(nameLower) || nameLower.includes(s.strategy_name.toLowerCase()))
        );
    }

    static clear(): void {
        this.skills.clear();
        this.strategies.clear();
    }
}
