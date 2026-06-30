import { Benchmark, BenchmarkResult, CapabilityCategory } from "./benchmarkTypes.js";

export const BenchmarkMetrics = {
    total_benchmarks_executed: 0,
    total_suites_executed: 0,
    overall_cii: 0,
    active_benchmarks: 0,
    regressions_detected: 0,
    improvements_detected: 0,

    updateExecution(result: BenchmarkResult) {
        this.total_benchmarks_executed++;
    },

    updateCII(newCii: number) {
        this.overall_cii = newCii;
    },

    getSummary() {
        return {
            total_benchmarks_executed: this.total_benchmarks_executed,
            total_suites_executed: this.total_suites_executed,
            overall_cii: this.overall_cii,
            active_benchmarks: this.active_benchmarks,
            regressions_detected: this.regressions_detected,
            improvements_detected: this.improvements_detected
        };
    }
};
