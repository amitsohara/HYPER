import { EvolutionProposal } from "./evolutionTypes.js";
import { EvolutionPolicies } from "./evolutionPolicies.js";

export class ExecutiveGovernance {
    public evaluateProposalCompleteness(proposal: EvolutionProposal): boolean {
        return EvolutionPolicies.isProposalComplete(proposal);
    }

    public computeEJS(proposal: EvolutionProposal): number {
        // Evolution Justification Score (EJS)
        // Weighted score based on Evidence Strength, Expected Gain, Cost, Risk, Validation, etc.
        const evidenceStrength = proposal.observed_evidence.length * 10; // Max 30
        const gain = 80; 
        const frequency = 50;
        const costFactor = Math.max(10, 100 - (proposal.estimated_engineering_effort / 10));
        const riskFactor = proposal.risk_assessment ? (100 - proposal.risk_assessment.overall_risk_score) : 50;
        const validation = proposal.validation_strategy ? 80 : 0;
        
        const ejs = (
            evidenceStrength * 0.15 +
            gain * 0.25 +
            frequency * 0.1 +
            costFactor * 0.15 +
            riskFactor * 0.2 +
            validation * 0.15
        );

        return Math.min(Math.max(ejs, 0), 100);
    }
}
