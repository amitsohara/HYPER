import { EvolutionProposal, RiskAssessment } from "./evolutionTypes.js";

export class ExecutiveRiskAssessment {
    public assess(proposal: EvolutionProposal): RiskAssessment {
        // Weighted calculation for risk
        const technical_risk_score = proposal.estimated_engineering_effort > 500 ? 80 : 30;
        const regression_risk = proposal.affected_cognitive_systems.length > 3 ? 75 : 20;
        const compatibility_risk = 40;
        const safety_risk = 10;
        const architectural_risk = proposal.expected_improvement.includes("architecture") ? 85 : 25;
        const confidence_estimate = 70;

        const overall_risk_score = (
            technical_risk_score * 0.2 +
            regression_risk * 0.25 +
            compatibility_risk * 0.15 +
            safety_risk * 0.2 +
            architectural_risk * 0.2
        ) * (1 - confidence_estimate / 200);

        return {
            technical_risk_score,
            regression_risk,
            compatibility_risk,
            safety_risk,
            architectural_risk,
            confidence_estimate,
            overall_risk_score
        };
    }
}
