import { EvolutionEvent } from "./memoryTypes.js";

export const MemoryMetrics = {
    total_events_recorded: 0,
    knowledge_artifacts_created: 0,
    lessons_learned: 0,
    decisions_archived: 0,
    reflections_generated: 0,
    causal_relationships_discovered: 0,

    recordEvent() {
        this.total_events_recorded++;
    },

    getSummary() {
        return {
            total_events_recorded: this.total_events_recorded,
            knowledge_artifacts_created: this.knowledge_artifacts_created,
            lessons_learned: this.lessons_learned,
            decisions_archived: this.decisions_archived,
            reflections_generated: this.reflections_generated,
            causal_relationships_discovered: this.causal_relationships_discovered
        };
    }
};
