import { ResearchImpact, ResearchHypothesis, ExperimentResult } from "./researchTypes.ts";

export class ImpactAssessmentEngine {
    public assess(hypothesis: ResearchHypothesis, result?: ExperimentResult): ResearchImpact {
        const conf = result ? result.confidence : hypothesis.confidence;
        
        return {
            scientific_significance: 85,
            expected_capability_improvement: 20,
            engineering_complexity: 40,
            research_maturity: conf > 80 ? 90 : 50,
            implementation_cost: 100,
            risk: 100 - conf,
            cross_domain_applicability: 60,
            roi: conf > 80 ? 95 : 30
        };
    }
}
