import { PolicyCandidate } from "./policy_candidate.js";
import { PolicyStatus } from "./evolution_types.js";
import { StrategyRepository } from "./strategy_repository.js";
import { ImprovementHistory } from "./improvement_history.js";

export class RollbackManager {
    static rollback(policyId: string, repo: StrategyRepository, history: ImprovementHistory) {
        const deployed = history.getDeployed();
        const policy = deployed.find(p => p.policy_id === policyId);
        
        if (policy) {
            policy.status = PolicyStatus.ROLLED_BACK;
            policy.updated_at = Date.now();
            // In a real system, restore the previous version of this target's policy
            repo.updatePolicy(policy.target, { _rollback: true }); 
        }
    }
}
