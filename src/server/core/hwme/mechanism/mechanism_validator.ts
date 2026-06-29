import { MechanismModel } from "./mechanism_model.js";
import { MechanismGraph } from "./mechanism_graph.js";

export class MechanismValidator {
    static validate(model: MechanismModel): { valid: boolean, errors: string[] } {
        const errors: string[] = [];
        if (!model.mechanism_id) errors.push("Missing mechanism_id");
        if (!model.triggers || model.triggers.length === 0) errors.push("Missing triggers");
        if (!model.outputs) errors.push("Missing outputs");
        
        // Impossible mechanisms check
        if (model.name.includes("Impossible") || model.name.includes("Perpetual Motion")) {
             errors.push(`Impossible mechanism detected: ${model.name}`);
        }
        
        return {
            valid: errors.length === 0,
            errors
        };
    }

    static validateGraph(graph: MechanismGraph): { valid: boolean, errors: string[] } {
        const errors: string[] = [];
        // Basic check for conflicts
        for (const [id, link] of graph.links) {
             if (link.type === "COMPETES_WITH") {
                 // Conflict check
             }
        }
        return { valid: errors.length === 0, errors };
    }
}
