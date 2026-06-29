import { TechnologyAssessment } from "./researchTypes.js";

export class TechnologyRadar {
    private technologies: Map<string, TechnologyAssessment> = new Map();

    public addTechnology(tech: TechnologyAssessment): void {
        this.technologies.set(tech.technology_id, tech);
    }

    public updateTechnologyStatus(id: string, status: any): void {
        const tech = this.technologies.get(id);
        if (tech) {
            tech.evaluation_status = status;
        }
    }

    public getTechnologies(): TechnologyAssessment[] {
        return Array.from(this.technologies.values());
    }
}
