import { BlueprintGenerator } from "./blueprintGenerator.js";
import { ArchitectureGenomeRepository } from "./architectureGenome.js";

export class ArchitectureMetricsCollector {
    public static collectMetrics(blueprints: BlueprintGenerator, genomes: ArchitectureGenomeRepository) {
        const allBlueprints = blueprints.getAllBlueprints();
        return {
            total_blueprints: allBlueprints.length,
            approved_blueprints: allBlueprints.filter(b => b.status === "APPROVED").length,
            genomes_tracked: genomes.getAll().length
        };
    }
}
