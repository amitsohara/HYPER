import { PolicyCandidate } from "./policy_candidate.js";
import { PolicyStatus } from "./evolution_types.js";
import { StrategyRepository } from "./strategy_repository.js";
import { ImprovementHistory } from "./improvement_history.js";

export class PolicyDeployer {
    static deploy(candidate: PolicyCandidate, repo: StrategyRepository, history: ImprovementHistory) {
        if (candidate.status === PolicyStatus.APPROVED) {
            repo.updatePolicy(candidate.target, candidate.changes);
            candidate.status = PolicyStatus.DEPLOYED;
            candidate.updated_at = Date.now();
            history.addRecord(candidate);
        }
    }
}
