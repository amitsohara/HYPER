import { SimulationBranch } from "./simulation_branch.js";

export class SimulationRanker {
    static rank(branches: SimulationBranch[]): SimulationBranch[] {
        return branches.sort((a, b) => {
            const scoreA = this.computeScore(a);
            const scoreB = this.computeScore(b);
            return scoreB - scoreA;
        });
    }
    
    private static computeScore(branch: SimulationBranch): number {
        if (!branch.metrics) return 0;
        return (branch.metrics.success_probability * 0.4) + 
               (branch.metrics.resource_efficiency * 0.2) + 
               (branch.metrics.robustness * 0.2) + 
               (branch.metrics.novelty_score * 0.2);
    }
}
