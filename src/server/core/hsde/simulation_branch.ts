import { SimulationStatus, SimulationMetricsData } from "./simulation_types.js";
import { SimulationWorld } from "./simulation_world.js";
import { SimulationScenario } from "./simulation_scenario.js";
import { SimulationResult } from "./simulation_result.js";

export interface SimulationBranch {
    branch_id: string;
    parent_branch_id?: string;
    scenario: SimulationScenario;
    world: SimulationWorld;
    timeline: number[];
    status: SimulationStatus;
    result?: SimulationResult;
    metrics?: SimulationMetricsData;
    confidence: number;
    created_at: number;
    updated_at: number;
}
