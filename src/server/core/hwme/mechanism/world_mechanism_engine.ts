import { MechanismModel } from "./mechanism_model.js";
import { MechanismGraph } from "./mechanism_graph.js";
import { MechanismExecutor } from "./mechanism_executor.js";
import { MechanismValidator } from "./mechanism_validator.js";
import { MechanismLibrary } from "./mechanism_library.js";

export class WorldMechanismEngine {
    library: MechanismLibrary = new MechanismLibrary();
    graph: MechanismGraph = new MechanismGraph();
    
    registerMechanism(model: MechanismModel): { success: boolean, errors?: string[] } {
        const val = MechanismValidator.validate(model);
        if (val.valid) {
            this.library.register(model);
            this.graph.addNode({ node_id: model.mechanism_id, mechanism: model });
            return { success: true };
        }
        return { success: false, errors: val.errors };
    }
    
    activateMechanism(mechanism_id: string): { success: boolean, effects?: any[], error?: string } {
        const model = this.library.get(mechanism_id);
        if (!model) return { success: false, error: "Mechanism not found" };
        
        return MechanismExecutor.activate(model);
    }
    
    deactivateMechanism(mechanism_id: string): { success: boolean, error?: string } {
         const model = this.library.get(mechanism_id);
         if (!model) return { success: false, error: "Mechanism not found" };
         
         return MechanismExecutor.deactivate(model);
    }
}
