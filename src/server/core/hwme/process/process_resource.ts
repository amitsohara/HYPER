import { ProcessResourceType } from "./process_types.js";

export interface ProcessResource {
    resource_id: string;
    type: ProcessResourceType;
    name: string;
    quantity: number;
    required: boolean;
}
