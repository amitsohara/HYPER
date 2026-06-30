import { CausalRelationship } from "./memoryTypes.js";
import { MemoryEventBus, MemoryEvents } from "./memoryEvents.js";
import { MemoryMetrics } from "./memoryMetrics.js";

export class CausalMemoryEngine {
    private eventBus = MemoryEventBus.getInstance();
    private relationships: Map<string, CausalRelationship> = new Map();

    public addRelationship(rel: CausalRelationship) {
        this.relationships.set(rel.causal_id, rel);
        MemoryMetrics.causal_relationships_discovered++;
        this.eventBus.publish(MemoryEvents.CAUSAL_RELATIONSHIP_DISCOVERED, rel);
    }

    public getEffectsForCause(cause_id: string): CausalRelationship[] {
        return Array.from(this.relationships.values()).filter(r => r.cause_id === cause_id);
    }

    public getCausesForEffect(effect_id: string): CausalRelationship[] {
        return Array.from(this.relationships.values()).filter(r => r.effect_id === effect_id);
    }
}
