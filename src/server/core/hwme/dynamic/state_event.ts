export interface StateEvent {
    event_id: string;
    type: string;
    description: string;
    timestamp: number;
    source: string;
    impact: Record<string, any>;
}
