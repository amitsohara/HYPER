import { EvolutionProposal } from "./evolutionTypes.js";

export class EvolutionPolicies {
    public static isProposalComplete(proposal: EvolutionProposal): boolean {
        return !!(
            proposal.problem_definition &&
            proposal.observed_evidence && proposal.observed_evidence.length > 0 &&
            proposal.measurable_impact &&
            proposal.expected_improvement &&
            proposal.affected_cognitive_systems && proposal.affected_cognitive_systems.length > 0 &&
            proposal.required_resources &&
            proposal.estimated_engineering_effort > 0 &&
            proposal.validation_strategy &&
            proposal.rollback_strategy
        );
    }

    public static validateEJS(proposal: EvolutionProposal): boolean {
        // Assume minimum acceptable EJS is 50 for evolution to proceed
        return (proposal.ejs || 0) >= 50;
    }

    public static validateRisk(proposal: EvolutionProposal): boolean {
        if (!proposal.risk_assessment) return false;
        // Assume max acceptable risk score is 70
        return proposal.risk_assessment.overall_risk_score <= 70;
    }
}
