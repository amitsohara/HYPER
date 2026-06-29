import { CapabilityImpactPrediction, AnyGap } from "./gapTypes.js";
import { GapEventBus, GapEvents } from "./gapEvents.js";

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export class ImpactSimulator {
    private eventBus = GapEventBus.getInstance();

    public simulateImpact(gap: AnyGap): CapabilityImpactPrediction {
        const prediction: CapabilityImpactPrediction = {
            prediction_id: uuidv4(),
            reasoning_improvement: 15,
            planning_improvement: gap.type === "CAPABILITY" ? 25 : 5,
            memory_improvement: 0,
            research_improvement: 10,
            coding_improvement: 5,
            simulation_improvement: 0,
            scientific_reasoning_improvement: 10,
            overall_cognitive_improvement: 12,
            confidence: 80,
            timestamp: Date.now()
        };

        this.eventBus.publish(GapEvents.IMPACT_PREDICTION_GENERATED, { prediction });
        return prediction;
    }
}
