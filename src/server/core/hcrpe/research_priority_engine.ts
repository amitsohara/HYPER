import { ResearchPlan } from "./research_task.js";

export class ResearchPriorityEngine {
    static rank(plans: ResearchPlan[]): ResearchPlan[] {
        return plans.sort((a, b) => {
            const scoreA = this.calculateScore(a.metrics);
            const scoreB = this.calculateScore(b.metrics);
            return scoreB - scoreA;
        });
    }

    private static calculateScore(metrics: any): number {
        if (!metrics) return 0;
        return (metrics.potential_impact * 2) + 
               metrics.knowledge_gain + 
               metrics.uncertainty_reduction - 
               metrics.cost - 
               metrics.time - 
               metrics.risk;
    }
}
