import { StrategicRecommendation, RecommendationType, ResearchInitiative, ResearchInvestment } from "./researchTypes.js";
import { ResearchEventBus, ResearchEvents } from "./researchEvents.js";

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export class ResearchRecommendationEngine {
    private eventBus = ResearchEventBus.getInstance();

    public generateRecommendation(initiative: ResearchInitiative, investment: ResearchInvestment): StrategicRecommendation {
        let type = RecommendationType.CONTINUE_RESEARCH;
        
        if (investment.roi < 10) {
            type = RecommendationType.PAUSE;
        } else if (investment.roi > 80 && initiative.status === "PROPOSED") {
            type = RecommendationType.LAUNCH_ENGINEERING_PROPOSAL;
        }
        
        const rec: StrategicRecommendation = {
            recommendation_id: uuidv4(),
            initiative_id: initiative.initiative_id,
            type,
            justification: `ROI score is ${investment.roi.toFixed(2)}`,
            expected_benefit: investment.expected_capability_gain,
            created_at: Date.now()
        };
        
        this.eventBus.publish(ResearchEvents.RECOMMENDATION_GENERATED, { recommendation: rec });
        return rec;
    }
}
