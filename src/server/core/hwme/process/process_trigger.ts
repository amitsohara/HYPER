import { ProcessTriggerType } from "./process_types.js";

export interface ProcessTrigger {
    trigger_id: string;
    type: ProcessTriggerType;
    condition: any; // Expression or event name
    description: string;
}
