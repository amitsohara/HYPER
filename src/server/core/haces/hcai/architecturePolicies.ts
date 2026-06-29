import { ArchitectureAlternative, ArchitectureRisk } from "./architectureTypes.js";

export class ArchitecturePolicies {
    public static isAlternativeViable(alt: ArchitectureAlternative): boolean {
        // High safety score and reasonable complexity
        return alt.safety_score >= 80 && alt.complexity_score <= 75;
    }

    public static isRiskAcceptable(risk: ArchitectureRisk): boolean {
        return risk.technical_risk_score < 70 && risk.failure_propagation_risk < 50;
    }
}
