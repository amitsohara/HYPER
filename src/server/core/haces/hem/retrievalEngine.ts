import { HistoryManager } from "./historyManager.js";
import { InstitutionalKnowledgeBase } from "./institutionalKnowledge.js";
import { CausalMemoryEngine } from "./causalMemory.js";
import { MemoryEventBus, MemoryEvents } from "./memoryEvents.js";

export class RetrievalEngine {
    private eventBus = MemoryEventBus.getInstance();

    constructor(
        private history: HistoryManager,
        private ikb: InstitutionalKnowledgeBase,
        private causal: CausalMemoryEngine
    ) {}

    public semanticSearch(query: string): any {
        // Mock semantic search across artifacts and events
        const artifacts = this.ikb.getAllArtifacts().filter(a => 
            a.content.includes(query) || a.rationale.includes(query)
        );
        const lessons = this.ikb.getAllLessons().filter(l => 
            l.description.includes(query) || l.context.includes(query)
        );

        const result = {
            query,
            artifacts,
            lessons
        };

        this.eventBus.publish(MemoryEvents.KNOWLEDGE_RETRIEVED, { query, count: artifacts.length + lessons.length });
        
        return result;
    }
}
