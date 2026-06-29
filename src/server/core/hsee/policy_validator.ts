import { PolicyCandidate } from "./policy_candidate.js";
import { PolicyStatus } from "./evolution_types.js";
import { BenchmarkRunner } from "./benchmark_runner.js";

export class PolicyValidator {
    static validate(candidate: PolicyCandidate): boolean {
        candidate.status = PolicyStatus.VALIDATING;
        const result = BenchmarkRunner.run(candidate);
        
        candidate.benchmark_metrics = result.metrics;
        
        if (result.success && result.metrics.accuracy >= 80) {
            candidate.status = PolicyStatus.APPROVED;
            return true;
        } else {
            candidate.status = PolicyStatus.REJECTED;
            return false;
        }
    }
}
