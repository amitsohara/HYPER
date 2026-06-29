export interface SimulationResult {
    result_id: string;
    branch_id: string;
    outcomes: string[];
    failure_probability: number;
    success_probability: number;
    resource_usage: any;
    time_estimation: number;
    risk_profile: any;
    unexpected_effects: string[];
}
