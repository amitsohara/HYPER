import { DiscoveryCandidate } from "./discovery_candidate.js";

export class DiscoveryRanker {
    static rank(candidates: DiscoveryCandidate[]): DiscoveryCandidate[] {
        return candidates.sort((a, b) => {
            const scoreA = a.novelty_score * 0.5 + a.impact_score * 0.5;
            const scoreB = b.novelty_score * 0.5 + b.impact_score * 0.5;
            return scoreB - scoreA;
        });
    }
}
