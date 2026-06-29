import { StepType } from "./process_types.js";
import { ProcessEffect } from "./process_effect.js";

export interface ProcessStep {
    step_id: string;
    name: string;
    type: StepType;
    description: string;
    duration: number; // Simulated time ticks
    effects: ProcessEffect[];
    sub_steps?: ProcessStep[]; // For NESTED/ITERATIVE
}
