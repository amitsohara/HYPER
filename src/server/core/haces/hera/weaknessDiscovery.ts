import { WeaknessAssessment, ResearchCategory } from "./researchTypes.js";
import { ResearchEventBus, ResearchEvents } from "./researchEvents.js";

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export class WeaknessDiscovery {
    private weaknesses: WeaknessAssessment[] = [];
    private eventBus = ResearchEventBus.getInstance();

    public analyzePerformance(missionData: any): void {
        // Mock analysis of weaknesses
        if (!missionData.success && missionData.reason === "timeout") {
            this.recordWeakness({
                assessment_id: uuidv4(),
                category: ResearchCategory.PLANNING,
                description: "Planning took too long and timed out",
                severity: 85,
                observed_frequency: 1,
                impact_on_missions: 90,
                detected_at: Date.now()
            });
        }
    }

    public recordWeakness(weakness: WeaknessAssessment): void {
        this.weaknesses.push(weakness);
        this.eventBus.publish(ResearchEvents.WEAKNESS_DETECTED, { weakness });
    }

    public getWeaknesses(): WeaknessAssessment[] {
        return [...this.weaknesses];
    }
}
