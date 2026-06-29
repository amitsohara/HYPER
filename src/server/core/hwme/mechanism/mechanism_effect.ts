export interface MechanismEffect {
    effect_id: string;
    target_type: "ENTITY" | "RELATIONSHIP" | "RESOURCE" | "PROCESS" | "CONSTRAINT" | "DYNAMIC_STATE" | "BELIEF" | "CONFIDENCE";
    target_id: string;
    operation: string; // e.g., UPDATE, CREATE, DELETE, TRIGGER_PROCESS
    value: any;
    description: string;
}
