import { ResearchInitiative, ResearchHypothesis } from "./researchTypes.js";

export class ResearchPolicies {
    public static isHypothesisValid(hypothesis: ResearchHypothesis): boolean {
        return !!(
            hypothesis.question &&
            hypothesis.hypothesis &&
            hypothesis.supporting_evidence && hypothesis.supporting_evidence.length > 0 &&
            hypothesis.evaluation_plan &&
            hypothesis.success_criteria && hypothesis.success_criteria.length > 0 &&
            hypothesis.estimated_cost
        );
    }

    public static canApproveInitiative(initiative: ResearchInitiative): boolean {
        return this.isHypothesisValid(initiative.hypothesis) && initiative.expected_impact > 50;
    }
}
