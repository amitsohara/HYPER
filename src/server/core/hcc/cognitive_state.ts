export interface CognitiveState {
    mission: string;
    mission_id: string;
    mission_type: string;
    mission_stage: "INITIALIZING" | "PLANNING" | "EXECUTING" | "SYNTHESIZING" | "COMPLETED";
    current_goal: string | null;
    goal_stack: any[]; // define later
    working_memory: any[];
    long_term_memory_refs: string[];
    beliefs: any[];
    assumptions: any[];
    constraints: any[];
    budget: any;
    timeline: any;
    risks: any[];
    stakeholders: any[];
    social_context: any;
    active_research: any[];
    world_state: any;
    decision_candidates: any[];
    current_recommendation: any;
    confidence: { score: number; uncertainty: number; limitations: string[] };
    attention: { focus: string; ignore: string[] };
    active_modules: string[];
    completed_modules: string[];
    pending_modules: string[];
    evidence: any[];
    events: any[];
    version: number;
}
