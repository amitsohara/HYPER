import { ArchitectureGenome } from "./architectureTypes.js";
import { ArchitectureEventBus, ArchitectureEvents } from "./architectureEvents.js";

export class ArchitectureGenomeRepository {
    private genomes: Map<string, ArchitectureGenome> = new Map();
    private eventBus = ArchitectureEventBus.getInstance();

    public save(genome: ArchitectureGenome) {
        this.genomes.set(genome.genome_id, genome);
        this.eventBus.publish(ArchitectureEvents.ARCHITECTURE_GENOME_UPDATED, { genome });
    }

    public get(id: string): ArchitectureGenome | undefined {
        return this.genomes.get(id);
    }

    public getAll(): ArchitectureGenome[] {
        return Array.from(this.genomes.values());
    }
}
