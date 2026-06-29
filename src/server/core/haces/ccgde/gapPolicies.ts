import { CapabilityProposal, InterventionScore } from "./gapTypes.js";

export class GapPolicies {
    public static isReusePreferred(reuseScore: number, newCapabilityScore: number): boolean {
        // Reuse is preferred if its score is within 15% of the new capability score
        return reuseScore >= newCapabilityScore * 0.85;
    }

    public static minimumCEDMScoreRequired(score: InterventionScore): boolean {
        return score.score >= 50 && score.expected_gain > score.cost * 0.5;
    }

    public static isDependencyValid(conflicts: number): boolean {
        return conflicts === 0;
    }
}
