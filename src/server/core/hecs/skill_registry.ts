export class SkillRegistry {
    private static skills: Set<string> = new Set();
    
    static registerSkill(skill: string) {
        this.skills.add(skill.toLowerCase());
    }
    
    static getSkills(): string[] {
        return Array.from(this.skills);
    }
}
