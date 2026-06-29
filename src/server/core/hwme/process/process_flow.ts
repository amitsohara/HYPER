import { ProcessStep } from "./process_step.js";
import { ProcessDependency } from "./process_dependency.js";

export interface ProcessFlow {
    flow_id: string;
    steps: ProcessStep[];
    dependencies: ProcessDependency[]; // Between steps
}
