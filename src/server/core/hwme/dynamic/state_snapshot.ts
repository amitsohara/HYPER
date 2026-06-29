export interface StateSnapshot {
    snapshot_id: string;
    timestamp: number;
    reason: string;
    variables: Record<string, any>;
    metrics: Record<string, any>;
}
