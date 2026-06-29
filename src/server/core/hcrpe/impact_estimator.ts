import { ResearchMetricsData } from "./research_types.js";

export class ImpactEstimator {
    static estimate(plan: any): ResearchMetricsData {
        return {
            potential_impact: Math.random() * 100,
            knowledge_gain: Math.random() * 100,
            uncertainty_reduction: Math.random() * 100,
            scientific_novelty: Math.random() * 100,
            cross_domain_usefulness: Math.random() * 100,
            mission_relevance: Math.random() * 100,
            cost: Math.random() * 50,
            time: Math.random() * 50,
            risk: Math.random() * 20
        };
    }
}
