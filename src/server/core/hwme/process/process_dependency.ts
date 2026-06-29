import { DependencyType } from "./process_types.js";

export interface ProcessDependency {
    dependency_id: string;
    source_id: string;
    target_id: string;
    type: DependencyType;
    description: string;
}
