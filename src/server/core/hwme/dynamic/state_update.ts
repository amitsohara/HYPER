export interface StateUpdate {
    timestamp: number;
    source: string;
    reason: string;
    changes: Record<string, any>;
}
