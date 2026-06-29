export enum PrincipleStatus {
    CANDIDATE = "CANDIDATE",
    VALIDATING = "VALIDATING",
    ACCEPTED = "ACCEPTED",
    REJECTED = "REJECTED",
    REFINED = "REFINED"
}

export interface PrincipleMetricsData {
    predictive_power: number;
    cross_domain_applicability: number;
    evidence_strength: number;
    simplicity: number;
    novelty: number;
    robustness: number;
}
