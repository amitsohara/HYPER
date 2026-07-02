import { Skill } from "../types.js";

export class SkillRegistry {
    private skills: Map<string, Skill> = new Map();

    registerSkill(skill: Skill) {
        this.skills.set(skill.id, skill);
    }

    getSkill(id: string): Skill | undefined {
        return this.skills.get(id);
    }
}
