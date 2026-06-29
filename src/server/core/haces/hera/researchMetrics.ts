import { ResearchMetrics } from "./researchTypes.js";
import { ResearchPortfolio } from "./researchPortfolio.js";
import { WeaknessDiscovery } from "./weaknessDiscovery.js";
import { GrandChallengeManager } from "./grandChallengeManager.js";

export class ResearchMetricsCollector {
    public static collectMetrics(
        portfolio: ResearchPortfolio,
        weaknesses: WeaknessDiscovery,
        challenges: GrandChallengeManager
    ): ResearchMetrics {
        return {
            active_initiatives: portfolio.getActiveInitiatives().length,
            completed_initiatives: portfolio.getAllInitiatives().filter(i => i.status === "COMPLETED").length,
            total_investment_roi: 0, // In a real system, aggregate across investments
            grand_challenges_active: challenges.getActiveChallenges().length,
            identified_weaknesses: weaknesses.getWeaknesses().length
        };
    }
}
