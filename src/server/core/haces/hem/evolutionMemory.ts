import { GoogleGenAI } from "@google/genai";
import { HistoryManager } from "./historyManager.js";
import { EvolutionKnowledgeGraph } from "./evolutionKnowledgeGraph.js";
import { TimelineEngine } from "./timelineEngine.js";
import { InstitutionalKnowledgeBase } from "./institutionalKnowledge.js";
import { WisdomEngine } from "./wisdomEngine.js";
import { DecisionMemory } from "./decisionMemory.js";
import { CausalMemoryEngine } from "./causalMemory.js";
import { RetrievalEngine } from "./retrievalEngine.js";
import { MemoryConsolidationEngine } from "./memoryConsolidation.js";
import { ReflectionEngine } from "./reflectionEngine.js";
import { NarrativeGenerator } from "./narrativeGenerator.js";
import { CognitiveExperienceEngine } from "./cognitiveExperienceEngine.js";
import { MemoryEventBus, MemoryEvents } from "./memoryEvents.js";
import { EvolutionEvent } from "./memoryTypes.js";

export class HyperMindEvolutionMemory {
    private eventBus = MemoryEventBus.getInstance();
    
    public historyManager = new HistoryManager();
    public knowledgeGraph = new EvolutionKnowledgeGraph();
    public timelineEngine = new TimelineEngine(this.historyManager);
    public ikb = new InstitutionalKnowledgeBase();
    public wisdomEngine = new WisdomEngine(this.ikb);
    public decisionMemory = new DecisionMemory();
    public causalMemory = new CausalMemoryEngine();
    
    public retrievalEngine = new RetrievalEngine(this.historyManager, this.ikb, this.causalMemory);
    public consolidationEngine = new MemoryConsolidationEngine(this.historyManager, this.ikb);
    
    public reflectionEngine = new ReflectionEngine();
    public narrativeGenerator = new NarrativeGenerator();
    public cognitiveExperience = new CognitiveExperienceEngine(this.ikb);

    public recordEvent(event: EvolutionEvent) {
        this.historyManager.recordEvent(event);
        // We could also dynamically update graph here
    }

    public async runReflectionCycle(ai: GoogleGenAI, cycle_id: string, recentEvents: EvolutionEvent[]) {
        // 1. Generate Reflection
        const reflection = await this.reflectionEngine.generateReflection(ai, cycle_id, recentEvents);
        
        // 2. Extract Wisdom
        await this.wisdomEngine.extractWisdom(ai, recentEvents);

        // 3. Synthesize Experience
        await this.cognitiveExperience.synthesizeExperience(ai, { reflection, events: recentEvents });

        return reflection;
    }
}
