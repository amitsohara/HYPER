export enum HypothesisStatus {
    CANDIDATE = "CANDIDATE",
    TESTING = "TESTING",
    VALIDATED = "VALIDATED",
    REJECTED = "REJECTED",
    REFINED = "REFINED"
}

export interface Prediction {
    prediction_id: string;
    description: string;
    expected_outcome: any;
    confidence: number;
}

export interface Experiment {
    experiment_id: string;
    description: string;
    success_criteria: string[];
    failure_criteria: string[];
    required_data: string[];
}
