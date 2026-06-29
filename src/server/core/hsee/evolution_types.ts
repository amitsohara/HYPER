export enum PolicyStatus {
    PROPOSED = "PROPOSED",
    VALIDATING = "VALIDATING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    DEPLOYED = "DEPLOYED",
    ROLLED_BACK = "ROLLED_BACK"
}

export enum PolicyTarget {
    ATTENTION = "ATTENTION",
    THINKING_BUDGET = "THINKING_BUDGET",
    SCHEDULER = "SCHEDULER",
    MODULE_PRIORITIES = "MODULE_PRIORITIES",
    STOPPING_CRITERIA = "STOPPING_CRITERIA",
    SIMULATION_DEPTH = "SIMULATION_DEPTH",
    BRANCHING_LIMITS = "BRANCHING_LIMITS",
    EXPLORATION_STRATEGY = "EXPLORATION_STRATEGY",
    CONFIDENCE_CALIBRATION = "CONFIDENCE_CALIBRATION",
    RESEARCH_PRIORITIZATION = "RESEARCH_PRIORITIZATION"
}

export interface PerformanceMetrics {
    mission_success: number;
    accuracy: number;
    reasoning_quality: number;
    simulation_quality: number;
    discovery_quality: number;
    execution_time_ms: number;
    resource_usage: number;
    attention_efficiency: number;
    module_utilization: number;
    recovery_from_errors: number;
}
