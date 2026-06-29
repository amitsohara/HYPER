import { ThoughtStatus, ModuleType } from "./thinking_types.js";

export interface ThoughtState {
    thought_id: string;
    parent_id?: string;
    child_ids: string[];
    description: string;
    priority: number;
    confidence: number;
    dependencies: string[];
    origin: string;
    status: ThoughtStatus;
    target_module?: ModuleType;
    results: any;
    created_at: number;
    updated_at: number;
}
