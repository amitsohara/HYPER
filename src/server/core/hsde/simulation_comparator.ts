import { SimulationBranch } from "./simulation_branch.js";

export class SimulationComparator {
    static compare(branchA: SimulationBranch, branchB: SimulationBranch): any {
        return {
             winner: (branchA.metrics?.success_probability || 0) > (branchB.metrics?.success_probability || 0) ? branchA.branch_id : branchB.branch_id,
             delta: Math.abs((branchA.metrics?.success_probability || 0) - (branchB.metrics?.success_probability || 0))
        };
    }
}
