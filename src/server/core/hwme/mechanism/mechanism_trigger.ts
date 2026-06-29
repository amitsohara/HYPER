import { MechanismTriggerType } from "./mechanism_types.js";

export interface MechanismTrigger {
    trigger_id: string;
    type: MechanismTriggerType;
    condition: any; // Logic expression
    description: string;
}
