import { BenchmarkGenome } from "./benchmarkTypes.js";

export class BenchmarkGenomeSystem {
    private genomes: Map<string, BenchmarkGenome> = new Map();

    public updateGenome(genome: BenchmarkGenome) {
        this.genomes.set(genome.benchmark_id, genome);
    }

    public getGenome(benchmark_id: string): BenchmarkGenome | undefined {
        return this.genomes.get(benchmark_id);
    }
}
