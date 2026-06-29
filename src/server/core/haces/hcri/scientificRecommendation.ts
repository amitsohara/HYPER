import { ResearchRecommendation, RecommendationAction, ResearchHypothesis, ResearchImpact } from "./researchTypes.ts";
import { ResearchEventBus, ResearchEvents } from "./researchEvents.ts";

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export class ScientificRecommendationEngine {
    private eventBus = ResearchEventBus.getInstance();

    public generateRecommendation(hypothesis: ResearchHypothesis, impact: ResearchImpact): ResearchRecommendation {
        let action = RecommendationAction.CONTINUE_RESEARCH;
        
        if (impact.roi > 80 && impact.research_maturity > 80) {
            action = RecommendationAction.LAUNCH_ENGINEERING_PROPOSAL;
        } else if (impact.roi < 20) {
            action = RecommendationAction.ARCHIVE_RESEARCH;
        }

        const rec: ResearchRecommendation = {
            recommendation_id: uuidv4(),
            hypothesis_id: hypothesis.hypothesis_id,
            action,
            justification: `Research ROI is ${impact.roi} and Maturity is ${impact.research_maturity}`,
            impact,
            timestamp: Date.now()
        };

        this.eventBus.publish(ResearchEvents.RECOMMENDATION_GENERATED, { recommendation: rec });
        return rec;
    }
}
