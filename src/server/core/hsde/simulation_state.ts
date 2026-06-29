export interface SimulationState {
    state_id: string;
    timestamp: number;
    entities: any[];
    resources: any[];
    relationships: any[];
    processes_active: string[];
}
