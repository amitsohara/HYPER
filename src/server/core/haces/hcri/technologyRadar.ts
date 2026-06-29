import { TechnologyAssessment } from "./researchTypes.ts";
import { ResearchEventBus, ResearchEvents } from "./researchEvents.ts";

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export class TechnologyRadar {
    private assessments: TechnologyAssessment[] = [];
    private eventBus = ResearchEventBus.getInstance();

    public evaluateTechnology(name: string, category: string): TechnologyAssessment {
        const tech: TechnologyAssessment = {
            technology_id: uuidv4(),
            name,
            category,
            capability_assessment: "Shows promise for improving world models.",
            maturity_level: 60,
            integration_risk: 30,
            expected_impact: 85,
            timestamp: Date.now()
        };
        
        this.assessments.push(tech);
        this.eventBus.publish(ResearchEvents.TECHNOLOGY_EVALUATED, { technology: tech });
        return tech;
    }
    
    public getAssessments(): TechnologyAssessment[] {
        return this.assessments;
    }
}
