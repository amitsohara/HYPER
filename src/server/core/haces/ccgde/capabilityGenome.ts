import { CapabilityGenome } from "./gapTypes.js";
import { GapEventBus, GapEvents } from "./gapEvents.js";

export class CapabilityGenomeRepository {
    private genomes: Map<string, CapabilityGenome> = new Map();
    private eventBus = GapEventBus.getInstance();

    public save(genome: CapabilityGenome) {
        this.genomes.set(genome.genome_id, genome);
        this.eventBus.publish(GapEvents.CAPABILITY_GENOME_UPDATED, { genome });
    }

    public get(id: string): CapabilityGenome | undefined {
        return this.genomes.get(id);
    }

    public getAll(): CapabilityGenome[] {
        return Array.from(this.genomes.values());
    }
}
