export enum SimulationStatus {
    CREATED = "CREATED",
    SCHEDULED = "SCHEDULED",
    RUNNING = "RUNNING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    REJECTED = "REJECTED"
}

export interface SimulationMetricsData {
    success_probability: number;
    resource_efficiency: number;
    time_efficiency: number;
    risk_profile: number;
    novelty_score: number;
    robustness: number;
}
