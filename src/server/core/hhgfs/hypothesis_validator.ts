import { HypothesisModel } from "./hypothesis_model.js";

export class HypothesisValidator {
    static validate(hypothesis: HypothesisModel): { valid: boolean, errors: string[] } {
        const errors: string[] = [];
        
        if (hypothesis.description && hypothesis.description.toLowerCase().includes("circular")) {
             errors.push("Circular hypotheses are invalid.");
        }
        
        if (hypothesis.assumptions && hypothesis.assumptions.some(a => a.toLowerCase().includes("impossible"))) {
             errors.push("Unsupported or impossible assumption.");
        }
        
        // Let's add physics violation checking (mock)
        if (hypothesis.title.includes("Perpetual") || hypothesis.description.includes("infinite energy")) {
             errors.push("Physics violations detected.");
        }
        
        return {
            valid: errors.length === 0,
            errors
        };
    }
}
