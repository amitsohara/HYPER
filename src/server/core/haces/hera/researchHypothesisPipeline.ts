import { ResearchHypothesis } from "./researchTypes.js";

export class ResearchHypothesisPipeline {
    public validateHypothesis(hypothesis: ResearchHypothesis): boolean {
        return !!(
            hypothesis.question &&
            hypothesis.hypothesis &&
            hypothesis.evaluation_plan &&
            hypothesis.success_criteria.length > 0 &&
            hypothesis.estimated_cost
        );
    }

    public evaluateHypothesisResult(hypothesis: ResearchHypothesis, results: any): "CONFIRMED" | "REVISED" | "REJECTED" {
        // Mock evaluation logic
        if (results.success_rate > 0.8) {
            hypothesis.decision = "CONFIRMED";
        } else if (results.success_rate > 0.4) {
            hypothesis.decision = "REVISED";
        } else {
            hypothesis.decision = "REJECTED";
        }
        return hypothesis.decision;
    }
}
