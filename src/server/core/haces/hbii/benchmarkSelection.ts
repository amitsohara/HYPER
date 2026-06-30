import { Benchmark, CapabilityCategory } from "./benchmarkTypes.js";
import { BenchmarkManager } from "./benchmarkManager.js";

export class BenchmarkSelectionEngine {
    constructor(private manager: BenchmarkManager) {}

    public selectBenchmarksForEvaluation(targetCapabilities: CapabilityCategory[], knownWeaknesses: CapabilityCategory[]): Benchmark[] {
        const active = this.manager.getActiveBenchmarks();
        
        // Select benchmarks that target the requested capabilities or known weaknesses
        return active.filter(b => 
            b.required_capabilities.some(c => targetCapabilities.includes(c) || knownWeaknesses.includes(c))
        );
    }
}
