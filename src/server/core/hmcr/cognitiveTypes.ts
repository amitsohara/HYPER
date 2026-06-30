import { v4 as uuidv4 } from "uuid";

export enum CognitiveMode {
    FOCUSED = "FOCUSED",
    ANALYTICAL = "ANALYTICAL",
    CREATIVE = "CREATIVE",
    RESEARCH = "RESEARCH",
    PLANNING = "PLANNING",
    SIMULATION = "SIMULATION",
    LEARNING = "LEARNING",
    REFLECTION = "REFLECTION",
    EXPLORATION = "EXPLORATION",
    IDLE = "IDLE"
}

export enum SpecialistType {
    OBSERVATION = "OBSERVATION",
    ATTENTION = "ATTENTION",
    WORKING_MEMORY = "WORKING_MEMORY",
    KNOWLEDGE = "KNOWLEDGE",
    WORLD_MODEL = "WORLD_MODEL",
    GOAL_MANAGER = "GOAL_MANAGER",
    CURIOSITY = "CURIOSITY",
    HYPOTHESIS = "HYPOTHESIS",
    REASONING = "REASONING",
    PLANNING = "PLANNING",
    SIMULATION = "SIMULATION",
    VERIFICATION = "VERIFICATION",
    DECISION = "DECISION",
    REFLECTION = "REFLECTION",
    LEARNING = "LEARNING",
    COMMUNICATION = "COMMUNICATION"
}

export interface CognitiveTask {
    task_id: string;
    description: string;
    input_data: any;
    priority: number;
    timestamp: number;
}

export interface CognitiveState {
    mode: CognitiveMode;
    active_specialists: SpecialistType[];
    confidence_level: number;
}

export interface CognitiveGoal {
    goal_id: string;
    type: 'EXPLICIT' | 'IMPLICIT';
    description: string;
    priority: number;
}

export interface Observation {
    observation_id: string;
    context: string;
    problem_identified: string;
    uncertainty: number;
}

export interface AttentionFocus {
    focus_id: string;
    important_signals: string[];
    ignored_signals: string[];
    priority_level: number;
}

export interface WorkingContext {
    context_id: string;
    active_thoughts: string[];
    temporary_data: any;
}

export interface Hypothesis {
    hypothesis_id: string;
    explanation: string;
    probability: number;
    assumptions: string[];
}

export interface ReasoningResult {
    reasoning_id: string;
    type: 'LOGICAL' | 'PROBABILISTIC' | 'CAUSAL' | 'ANALOGICAL' | 'CONSTRAINT' | 'MATHEMATICAL';
    conclusion: string;
    confidence: number;
}

export interface SimulationResult {
    simulation_id: string;
    predicted_outcome: string;
    risk_level: number;
    consequences: string[];
}

export interface VerificationResult {
    verification_id: string;
    is_consistent: boolean;
    contradictions_found: string[];
    confidence: number;
}

export interface Decision {
    decision_id: string;
    action: string;
    rationale: string;
    uncertainty: number;
    alternatives_considered: string[];
}

export interface Reflection {
    reflection_id: string;
    correctness_evaluation: string;
    weaknesses_identified: string[];
    lessons_learned: string[];
    recommendations: string[];
}

export interface LearningUpdate {
    update_id: string;
    knowledge_updated: boolean;
    strategies_updated: string[];
}

export interface ConfidenceScore {
    overall_confidence: number;
    metrics: Record<string, number>;
}

export interface ToolRequest {
    request_id: string;
    tool_name: string;
    justification: string;
    parameters: any;
}

export interface ToolResponse {
    request_id: string;
    result: any;
    success: boolean;
}
