import { Benchmark, BenchmarkSuite, CapabilityCategory } from "./benchmarkTypes.js";
import { v4 as uuidv4 } from "uuid";

export class BenchmarkManager {
    private benchmarks: Map<string, Benchmark> = new Map();
    private suites: Map<string, BenchmarkSuite> = new Map();

    public registerBenchmark(benchmark: Benchmark) {
        this.benchmarks.set(benchmark.benchmark_id, benchmark);
    }

    public createSuite(name: string, targetCapabilities: CapabilityCategory[]): BenchmarkSuite {
        const suiteBenchmarks = Array.from(this.benchmarks.values()).filter(b => 
            b.required_capabilities.some(c => targetCapabilities.includes(c)) && b.status === 'ACTIVE'
        );

        const suite: BenchmarkSuite = {
            suite_id: uuidv4(),
            name,
            benchmarks: suiteBenchmarks,
            target_capabilities: targetCapabilities
        };

        this.suites.set(suite.suite_id, suite);
        return suite;
    }

    public getActiveBenchmarks(): Benchmark[] {
        return Array.from(this.benchmarks.values()).filter(b => b.status === 'ACTIVE');
    }

    public retireBenchmark(benchmark_id: string) {
        const b = this.benchmarks.get(benchmark_id);
        if (b) {
            b.status = 'RETIRED';
        }
    }
}
