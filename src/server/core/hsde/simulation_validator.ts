import { SimulationBranch } from "./simulation_branch.js";

export class SimulationValidator {
    static validate(branch: SimulationBranch): { valid: boolean, errors: string[] } {
        const errors: string[] = [];
        
        if (branch.scenario.assumptions.some(a => a.toLowerCase().includes("impossible"))) {
             errors.push("Impossible simulation due to assumptions.");
        }
        
        if (branch.scenario.assumptions.some(a => a.toLowerCase().includes("physics violation"))) {
             errors.push("Physics violation detected.");
        }
        
        if (branch.scenario.assumptions.some(a => a.toLowerCase().includes("circular"))) {
             errors.push("Circular simulation detected.");
        }
        
        return { valid: errors.length === 0, errors };
    }
}
