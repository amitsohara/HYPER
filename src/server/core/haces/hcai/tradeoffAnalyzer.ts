import { ArchitectureProposal, ArchitectureDecision } from "./architectureTypes.js";
import { ArchitecturePolicies } from "./architecturePolicies.js";

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export class TradeoffAnalyzer {
    public analyzeAndSelect(proposal: ArchitectureProposal): ArchitectureDecision {
        let bestAlt = proposal.alternatives[0];
        let maxScore = -1;

        for (const alt of proposal.alternatives) {
            if (ArchitecturePolicies.isAlternativeViable(alt)) {
                // simple heuristic
                const score = (alt.performance_estimate + alt.scalability_score) / (alt.complexity_score + 1);
                if (score > maxScore) {
                    maxScore = score;
                    bestAlt = alt;
                }
            }
        }

        return {
            decision_id: uuidv4(),
            proposal_id: proposal.proposal_id,
            selected_alternative_id: bestAlt.alternative_id,
            justification: `Selected alternative offers best performance/complexity ratio (${maxScore.toFixed(2)}) while remaining viable.`,
            tradeoffs_accepted: ["Higher initial engineering cost", "Increased inter-module latency"],
            timestamp: Date.now()
        };
    }
}
