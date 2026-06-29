export interface StateTransition {
    transition_id: string;
    trigger: string;
    source_state_id: string;
    target_state_id: string;
    reason: string;
    timestamp: number;
    confidence: number;
    changes: Record<string, any>; // Key path to new value
}
