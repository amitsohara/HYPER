import { CapabilityRoadmap, EvolutionRecommendation } from "./gapTypes.js";
import { GapEventBus, GapEvents } from "./gapEvents.js";

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export class RoadmapGenerator {
    private eventBus = GapEventBus.getInstance();

    public generateRoadmap(recommendations: EvolutionRecommendation[]): CapabilityRoadmap {
        const sorted = [...recommendations].sort((a, b) => b.priority - a.priority);

        const immediate: EvolutionRecommendation[] = [];
        const nearTerm: EvolutionRecommendation[] = [];
        const midTerm: EvolutionRecommendation[] = [];

        for (const rec of sorted) {
            if (rec.action_type === "LEARN_NEW_KNOWLEDGE" || rec.action_type === "UPDATE_POLICY" || rec.action_type === "REUSE_EXISTING_CAPABILITY") {
                immediate.push(rec);
            } else if (rec.action_type === "OPTIMIZE_ALGORITHM") {
                nearTerm.push(rec);
            } else {
                midTerm.push(rec);
            }
        }

        const roadmap: CapabilityRoadmap = {
            roadmap_id: uuidv4(),
            immediate_improvements: immediate,
            near_term_improvements: nearTerm,
            mid_term_improvements: midTerm,
            long_term_improvements: [], // Long-term would involve grand challenges
            research_dependencies: ["HACES HERA Alignment"],
            engineering_milestones: ["Sprint 1: Quick wins", "Sprint 2: Algorithm updates", "Sprint 3: New Capabilities"],
            expected_benchmark_gains: {
                "Reasoning": 12,
                "Planning": 8
            },
            timestamp: Date.now()
        };

        this.eventBus.publish(GapEvents.CAPABILITY_ROADMAP_UPDATED, { roadmap });
        return roadmap;
    }
}
