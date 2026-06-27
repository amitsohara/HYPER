import { HeuristicAbstraction } from "./abstraction_types.js";
import { AbstractionStore } from "./abstraction_store.js";

export class HeuristicApplicabilityScorer {
    static score(targetMission: string, targetDomain: string, heuristics: HeuristicAbstraction[]): any[] {
        // In a real system, we might use an LLM or vector DB to score match.
        // Here we'll do a simple heuristic matching based on domains and string inclusion.

        return heuristics.map(h => {
            let score = 50; // base score

            // mission/domain match
            const domainMatch = h.applicable_domains.some(d => d.toLowerCase() === targetDomain.toLowerCase());
            if (domainMatch) score += 20;

            const missionMatch = h.if_conditions.some(cond => targetMission.toLowerCase().includes(cond.toLowerCase()));
            if (missionMatch) score += 20;

            // transferability and confidence
            score += (h.transferability / 10);
            score += (h.confidence / 10);

            // Cap at 100
            score = Math.min(100, score);

            let recommendation = "do_not_use";
            let reason = "Not applicable to this mission.";

            if (score >= 70) {
                recommendation = "use";
                reason = "Strong domain and condition match.";
            } else if (score >= 50 && h.transferability >= 80) {
                // Analogy or cross-domain possibility
                recommendation = "use_with_warning";
                reason = "High transferability but low direct domain match. Use with caution.";
            }

            return {
                heuristic: h,
                heuristic_id: h.abstraction_id,
                applicability_score: score,
                reason: reason,
                use_recommendation: recommendation
            };
        }).filter(result => result.use_recommendation !== "do_not_use")
        .sort((a, b) => b.applicability_score - a.applicability_score);
    }
}
