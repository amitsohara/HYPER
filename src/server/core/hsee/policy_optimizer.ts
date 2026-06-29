import { PolicyCandidate } from "./policy_candidate.js";
import { PolicyTarget, PolicyStatus } from "./evolution_types.js";

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export class PolicyOptimizer {
    static generate(bottlenecks: string[]): PolicyCandidate[] {
        const candidates: PolicyCandidate[] = [];
        
        if (bottlenecks.includes("OVERTHINKING")) {
            candidates.push({
                policy_id: uuidv4(),
                version: 1,
                target: PolicyTarget.BRANCHING_LIMITS,
                description: "Reduce maximum branching factor to prevent overthinking.",
                changes: { max_exploration_branches: 20 },
                status: PolicyStatus.PROPOSED,
                created_at: Date.now(),
                updated_at: Date.now(),
                reason: "Detected excessive branches in recent missions."
            });
        }
        
        if (bottlenecks.includes("POOR_CONFIDENCE_CALIBRATION")) {
            candidates.push({
                policy_id: uuidv4(),
                version: 1,
                target: PolicyTarget.CONFIDENCE_CALIBRATION,
                description: "Increase evidence weight for confidence updates.",
                changes: { evidence_weight: 1.5 },
                status: PolicyStatus.PROPOSED,
                created_at: Date.now(),
                updated_at: Date.now(),
                reason: "Confidence did not match outcome reality."
            });
        }
        
        if (candidates.length === 0) {
            candidates.push({
                policy_id: uuidv4(),
                version: 1,
                target: PolicyTarget.SCHEDULER,
                description: "General scheduler optimization.",
                changes: { priority_boost: 1.1 },
                status: PolicyStatus.PROPOSED,
                created_at: Date.now(),
                updated_at: Date.now(),
                reason: "Continuous improvement."
            });
        }
        
        return candidates;
    }
}
