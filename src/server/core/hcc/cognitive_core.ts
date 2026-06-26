import { CognitiveState } from "./cognitive_state.js";
import { StateEventBus, EventType } from "./state_event_bus.js";
import { WorkingMemory } from "./working_memory.js";
import { AttentionManager } from "./attention_manager.js";
import { GoalStack, Goal } from "./goal_stack.js";
import { EvidenceStore, Evidence } from "./evidence_store.js";
import { ConfidenceManager } from "./confidence_manager.js";
import { ContextManager } from "./context_manager.js";

export class HyperMindCognitiveCore {
    private state: CognitiveState;
    private eventBus: StateEventBus;
    private workingMemory: WorkingMemory;
    private attentionManager: AttentionManager;
    private goalStack: GoalStack;
    private evidenceStore: EvidenceStore;

    constructor(missionText: string) {
        this.eventBus = new StateEventBus();
        this.workingMemory = new WorkingMemory(20);
        this.attentionManager = new AttentionManager();
        this.goalStack = new GoalStack();
        this.evidenceStore = new EvidenceStore();

        this.state = {
            mission: missionText,
            mission_id: Math.random().toString(36).substring(7),
            mission_type: "UNKNOWN",
            mission_stage: "INITIALIZING",
            current_goal: null,
            goal_stack: [],
            working_memory: [],
            long_term_memory_refs: [],
            beliefs: [],
            assumptions: [],
            constraints: [],
            budget: null,
            timeline: null,
            risks: [],
            stakeholders: [],
            social_context: null,
            active_research: [],
            world_state: null,
            decision_candidates: [],
            current_recommendation: null,
            confidence: { score: 0, uncertainty: 100, limitations: [] },
            attention: this.attentionManager.getState(),
            active_modules: [],
            completed_modules: [],
            pending_modules: [],
            evidence: [],
            events: [],
            version: 1
        };

        this.goalStack.push({
            id: 'root_goal',
            description: missionText,
            status: 'ACTIVE'
        });

        this.syncState();
    }

    private syncState() {
        this.state.working_memory = this.workingMemory.getStateRepresentation();
        this.state.attention = this.attentionManager.getState();
        this.state.goal_stack = this.goalStack.getState();
        this.state.current_goal = this.goalStack.getTopGoal()?.description || null;
        this.state.evidence = this.evidenceStore.getAll();
        this.state.confidence = ConfidenceManager.calculateConfidence(this.evidenceStore, this.state);
        this.state.events = this.eventBus.getHistory();
    }

    public getState(): CognitiveState {
        this.syncState();
        return { ...this.state };
    }

    public getContext(): string {
        this.syncState();
        return ContextManager.buildContext(this.state);
    }

    // Module Interfaces
    public updateState(partialState: Partial<CognitiveState>, sourceModule: string) {
        this.state = { ...this.state, ...partialState };
        this.state.version += 1;
        this.syncState();
    }

    public publishEvent(type: EventType, payload: any, sourceModule: string) {
        this.eventBus.publish({ type, payload, sourceModule, version: this.state.version });
        this.state.version += 1;
        this.syncState();
    }

    public subscribe(type: EventType | "*", handler: (event: any) => void) {
        this.eventBus.subscribe(type, handler);
    }

    public addEvidence(ev: Omit<Evidence, "id" | "timestamp">) {
        this.evidenceStore.addEvidence(ev);
        this.publishEvent("EVIDENCE_ADDED", ev, ev.module);
    }

    public addWorkingMemory(fact: string, relevance: number = 0.5) {
        this.workingMemory.addFact(fact, relevance);
        this.state.version += 1;
        this.syncState();
    }
    
    public setAttention(focus: string) {
        this.attentionManager.setFocus(focus);
        this.publishEvent("ATTENTION_SHIFTED", { focus }, "CORE");
        this.state.version += 1;
        this.syncState();
    }
}
