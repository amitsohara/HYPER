import { SessionStatus, ThoughtStatus, ModuleType } from "./thinking_types.js";
import { ThinkingBudget } from "./thinking_budget.js";
import { AttentionController } from "./attention_controller.js";
import { ThoughtStack } from "./thought_stack.js";
import { GoalAnalyzer } from "./goal_analyzer.js";
import { ThinkingEvents } from "./thinking_events.js";
import { ThinkingCheckpoint } from "./thinking_checkpoint.js";

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export class ThinkingSession {
    session_id: string;
    mission: string;
    status: SessionStatus;
    
    budget: ThinkingBudget;
    attention: AttentionController;
    stack: ThoughtStack;
    events: ThinkingEvents;
    
    analysis: any;
    confidence: number = 0;
    
    module_history: any[] = [];
    decision_history: any[] = [];
    checkpoints: ThinkingCheckpoint[] = [];
    
    constructor(mission: string) {
        this.session_id = uuidv4();
        this.mission = mission;
        this.status = SessionStatus.CREATED;
        
        this.budget = new ThinkingBudget();
        this.attention = new AttentionController();
        this.stack = new ThoughtStack();
        this.events = new ThinkingEvents();
        
        this.analysis = GoalAnalyzer.analyze(mission);
        
        // Setup initial thought
        this.stack.addThought({
            thought_id: uuidv4(),
            child_ids: [],
            description: `Solve mission: ${mission}`,
            priority: 100,
            confidence: 0,
            dependencies: [],
            origin: "SYSTEM",
            status: ThoughtStatus.PENDING,
            target_module: ModuleType.PLANNER,
            results: null,
            created_at: Date.now(),
            updated_at: Date.now()
        });
    }
    
    saveCheckpoint() {
        const state = {
            status: this.status,
            confidence: this.confidence,
            budget: { ...this.budget },
            thoughts: this.stack.getAll().map(t => ({...t}))
        };
        this.checkpoints.push(new ThinkingCheckpoint(uuidv4(), state));
    }
}
