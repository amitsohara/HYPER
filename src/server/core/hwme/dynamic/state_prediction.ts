export interface StatePrediction {
    prediction_id: string;
    assumptions: string[];
    confidence: number;
    prediction_horizon: number; // e.g., ms into the future
    predicted_state: Record<string, any>;
    predicted_events: string[];
    timestamp: number;
}
