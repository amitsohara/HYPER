import { PrincipleModel } from "./principle_model.js";

export class PrincipleValidator {
    static validate(principle: PrincipleModel): { valid: boolean, errors: string[] } {
        const errors: string[] = [];

        // Reject if contradictory evidence is overwhelming
        if (principle.counter_examples && principle.evidence) {
             const proScore = principle.evidence.reduce((sum, e) => sum + e.strength, 0);
             const conScore = principle.counter_examples.reduce((sum, e) => sum + e.strength, 0);
             if (conScore > proScore) {
                 errors.push("Contradictory evidence outweighs supporting evidence.");
             }
        }
        
        if (principle.evidence && principle.evidence.length === 0) {
             // In early generation we might not have evidence attached, 
             // but strict validation expects some.
        }
        
        if (principle.description && principle.description.includes("Circular explanation")) {
             errors.push("Circular explanations are invalid.");
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }
}
