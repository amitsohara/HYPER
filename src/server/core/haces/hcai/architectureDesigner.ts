import { ArchitectureProposal, ArchitectureAlternative } from "./architectureTypes.js";
import { ArchitectureEventBus, ArchitectureEvents } from "./architectureEvents.js";

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export class ArchitectureDesigner {
    private eventBus = ArchitectureEventBus.getInstance();

    public designArchitecture(capabilityId: string, evidenceId: string): ArchitectureProposal {
        const alt1: ArchitectureAlternative = {
            alternative_id: uuidv4(),
            description: "Monolithic planning module",
            patterns_used: ["Pipeline"],
            performance_estimate: 80,
            complexity_score: 40,
            maintainability_score: 70,
            scalability_score: 50,
            reliability_score: 90,
            safety_score: 95,
            engineering_effort_estimate: 100,
            expected_benchmark_gain: 5
        };

        const alt2: ArchitectureAlternative = {
            alternative_id: uuidv4(),
            description: "Distributed multi-agent planner",
            patterns_used: ["Distributed agent collaboration", "Blackboard architecture"],
            performance_estimate: 95,
            complexity_score: 85,
            maintainability_score: 50,
            scalability_score: 95,
            reliability_score: 80,
            safety_score: 85,
            engineering_effort_estimate: 300,
            expected_benchmark_gain: 15
        };

        const proposal: ArchitectureProposal = {
            proposal_id: uuidv4(),
            name: "New Planner Architecture",
            capability_id: capabilityId,
            scientific_evidence_id: evidenceId,
            alternatives: [alt1, alt2],
            timestamp: Date.now()
        };

        this.eventBus.publish(ArchitectureEvents.ARCHITECTURE_DESIGNED, { proposal });
        return proposal;
    }
}
