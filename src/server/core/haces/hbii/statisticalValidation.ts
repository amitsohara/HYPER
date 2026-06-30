import { v4 as uuidv4 } from "uuid";
import { StatisticalValidation, BenchmarkResult } from "./benchmarkTypes.js";
import { BenchmarkPolicies } from "./benchmarkPolicies.js";

export class StatisticalValidationOffice {
    
    public validateResults(results: BenchmarkResult[]): StatisticalValidation {
        // Mock statistical validation
        const scores = results.map(r => r.score);
        const mean = scores.reduce((a, b) => a + b, 0) / (scores.length || 1);
        const variance = scores.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (scores.length || 1);
        
        const isSignificant = variance <= BenchmarkPolicies.MAX_VARIANCE_ALLOWED;

        return {
            validation_id: uuidv4(),
            result_id: results[0]?.result_id || "unknown",
            variance,
            confidence_interval: [mean - variance, mean + variance],
            is_significant: isSignificant,
            p_value: isSignificant ? 0.01 : 0.2,
            reproducibility_score: isSignificant ? 95 : 60
        };
    }
}
