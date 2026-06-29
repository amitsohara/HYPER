import { ResearchHypothesis, ExperimentResult } from "./researchTypes.ts";

export class ResearchPolicies {
    public static isHypothesisValid(hypothesis: ResearchHypothesis): boolean {
        return !!(
            hypothesis.statement &&
            hypothesis.evaluation_plan &&
            hypothesis.success_metrics.length > 0
        );
    }

    public static isExperimentSuccessful(result: ExperimentResult): boolean {
        // Mock policy
        return result.confidence >= 80;
    }

    public static requiresPeerReview(result: ExperimentResult): boolean {
        // Major discoveries require peer review
        return result.confidence >= 90 || result.conclusion.includes("breakthrough");
    }
}
