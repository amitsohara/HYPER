import { EvolutionCycle } from "./evolution_cycle.js";
import { StrategyRepository } from "./strategy_repository.js";
import { ImprovementHistory } from "./improvement_history.js";
import { RollbackManager } from "./rollback_manager.js";
import { PolicyCandidate } from "./policy_candidate.js";
import { BenchmarkRunner } from "./benchmark_runner.js";

export class SelfEvolutionEngine {
    repo: StrategyRepository = new StrategyRepository();
    history: ImprovementHistory = new ImprovementHistory();
    cycle: EvolutionCycle;
    
    constructor() {
        this.cycle = new EvolutionCycle(this.repo, this.history);
    }
    
    evaluateMissions(missions: any[]): PolicyCandidate[] {
        return this.cycle.run(missions);
    }
    
    getHistory() {
        return this.history.getHistory();
    }
    
    getDeployedPolicies() {
        return this.history.getDeployed();
    }
    
    rollback(policyId: string) {
        RollbackManager.rollback(policyId, this.repo, this.history);
    }
    
    runBenchmark(candidate: PolicyCandidate) {
        return BenchmarkRunner.run(candidate);
    }
}
