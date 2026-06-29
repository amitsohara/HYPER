import { MechanismType, MechanismStatus } from "./mechanism_types.js";
import { MechanismTrigger } from "./mechanism_trigger.js";
import { MechanismRule } from "./mechanism_rule.js";
import { MechanismEffect } from "./mechanism_effect.js";

export interface MechanismModel {
    mechanism_id: string;
    name: string;
    description: string;
    domain: MechanismType;
    confidence: number;
    status: MechanismStatus;
    source: string;
    created_at: number;
    updated_at: number;

    triggers: MechanismTrigger[];
    conditions: string[];
    inputs: string[];
    internal_rules: MechanismRule[];
    transformation_logic: string;
    outputs: string[];
    side_effects: MechanismEffect[];
    failure_modes: string[];
}
