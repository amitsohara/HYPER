import { CapabilityProposal, AnyGap } from "./gapTypes.js";
import { ImpactSimulator } from "./impactSimulator.js";
import { GapEventBus, GapEvents } from "./gapEvents.js";

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export class CapabilityInnovationEngine {
    private impactSimulator: ImpactSimulator;
    private eventBus = GapEventBus.getInstance();

    constructor(impactSimulator: ImpactSimulator) {
        this.impactSimulator = impactSimulator;
    }

    public proposeNewCapability(gap: AnyGap): CapabilityProposal {
        const expected_benefit = gap.severity * 0.8;
        const estimated_implementation_effort = 200;
        const risk = 30;
        const roi = (expected_benefit * 100) / estimated_implementation_effort;

        const proposal: CapabilityProposal = {
            proposal_id: uuidv4(),
            name: `New Capability to address ${gap.type}`,
            purpose: gap.description,
            expected_benefit,
            affected_domains: ["Core Reasoning"],
            interfaces: ["IReasoningEngine"],
            dependencies: [],
            estimated_implementation_effort,
            benchmark_impact: 10,
            risk,
            validation_strategy: "Unit and Integration Testing",
            confidence: 85,
            roi,
            impact_prediction: this.impactSimulator.simulateImpact(gap)
        };

        this.eventBus.publish(GapEvents.CAPABILITY_PROPOSED, { proposal });
        return proposal;
    }
}
