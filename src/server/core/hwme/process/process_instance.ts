import { ProcessStatus } from "./process_types.js";
import { ProcessModel } from "./process_model.js";

export interface ProcessInstance {
    instance_id: string;
    model: ProcessModel;
    status: ProcessStatus;
    start_time?: number;
    end_time?: number;
    current_step_id?: string;
    history: any[];
    allocated_resources: Record<string, any>;
    simulation_mode: boolean;
}
