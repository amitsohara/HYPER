import { ProcessResource } from "./process_resource.js";
import { ProcessDependency } from "./process_dependency.js";
import { ProcessTrigger } from "./process_trigger.js";
import { ProcessFlow } from "./process_flow.js";

export interface ProcessModel {
    process_id: string;
    name: string;
    description: string;
    domain: string;
    purpose: string;
    owner: string;
    priority: number;
    
    inputs: string[];
    outputs: string[];
    preconditions: string[];
    postconditions: string[];
    resources: ProcessResource[];
    dependencies: ProcessDependency[];
    constraints: string[];
    
    duration: number;
    risk: string;
    confidence: number;
    
    flow: ProcessFlow;
    triggers: ProcessTrigger[];
}
