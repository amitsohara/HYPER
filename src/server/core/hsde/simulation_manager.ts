import { SimulationBranch } from "./simulation_branch.js";

export class SimulationManager {
    private branches: Map<string, SimulationBranch> = new Map();

    addBranch(branch: SimulationBranch) {
        this.branches.set(branch.branch_id, branch);
    }
    
    getBranch(id: string): SimulationBranch | undefined {
        return this.branches.get(id);
    }
    
    getAllBranches(): SimulationBranch[] {
        return Array.from(this.branches.values());
    }
}
