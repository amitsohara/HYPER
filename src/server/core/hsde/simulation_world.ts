import { SimulationState } from "./simulation_state.js";

export interface SimulationWorld {
    world_id: string;
    base_reality_snapshot: any;
    current_state: SimulationState;
    history: SimulationState[];
}
