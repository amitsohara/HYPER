import { SimulationBranch } from "./simulation_branch.js";
import { DiscoveryCandidate } from "./discovery_candidate.js";

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export class DiscoveryEngine {
    static analyze(branches: SimulationBranch[]): DiscoveryCandidate[] {
        const discoveries: DiscoveryCandidate[] = [];
        
        for (const branch of branches) {
            if (branch.status === "COMPLETED" && branch.metrics && branch.metrics.novelty_score > 50) {
                 discoveries.push({
                     candidate_id: uuidv4(),
                     source_branch_id: branch.branch_id,
                     description: `Novel emergent strategy from ${branch.scenario.mission} (Branch ${branch.branch_id})`,
                     type: "STRATEGY",
                     novelty_score: branch.metrics.novelty_score,
                     impact_score: branch.metrics.success_probability || 0,
                     created_at: Date.now()
                 });
            }
        }
        
        return discoveries;
    }
}
