import { SimulationBranch } from "./simulation_branch.js";
import { SimulationStatus } from "./simulation_types.js";

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export class SimulationRunner {
    static execute(branch: SimulationBranch): void {
        branch.status = SimulationStatus.RUNNING;
        branch.updated_at = Date.now();
        
        // Mock execution
        const successProb = branch.scenario.assumptions.some(a => a.toLowerCase().includes("impossible")) ? 0 : Math.random() * 100;
        
        branch.result = {
            result_id: uuidv4(),
            branch_id: branch.branch_id,
            outcomes: ["Execution complete", "State modified"],
            success_probability: successProb,
            failure_probability: 100 - successProb,
            resource_usage: { energy: Math.random() * 100 },
            time_estimation: Math.random() * 1000,
            risk_profile: { level: Math.random() > 0.5 ? "HIGH" : "LOW" },
            unexpected_effects: Math.random() > 0.8 ? ["Anomaly detected"] : []
        };
        
        branch.metrics = {
            success_probability: branch.result.success_probability,
            resource_efficiency: 100 - (branch.result.resource_usage.energy || 0),
            time_efficiency: 1000 - branch.result.time_estimation,
            risk_profile: branch.result.risk_profile.level === "HIGH" ? 20 : 80,
            novelty_score: Math.random() * 100,
            robustness: Math.random() * 100
        };
        
        branch.status = SimulationStatus.COMPLETED;
        branch.updated_at = Date.now();
    }
}
