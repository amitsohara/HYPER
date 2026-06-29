import { MechanismModel } from "./mechanism_model.js";
import { MechanismStatus } from "./mechanism_types.js";

export class MechanismExecutor {
    static activate(mechanism: MechanismModel): { success: boolean, effects: any[], error?: string } {
        if (mechanism.status === MechanismStatus.REJECTED) {
            return { success: false, effects: [], error: "Cannot activate rejected mechanism" };
        }
        
        mechanism.status = MechanismStatus.ACTIVE;
        mechanism.updated_at = Date.now();
        
        return {
            success: true,
            effects: mechanism.side_effects || []
        };
    }
    
    static deactivate(mechanism: MechanismModel): { success: boolean } {
        mechanism.status = MechanismStatus.INACTIVE;
        mechanism.updated_at = Date.now();
        return { success: true };
    }
}
