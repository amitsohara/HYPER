export enum DiagnosisType {
    SUCCESS = "SUCCESS",
    FAILURE = "FAILURE",
    ANOMALY = "ANOMALY",
    REGRESSION = "REGRESSION"
}

export enum DiagnosticLayer {
    REASONING = "REASONING",
    PLANNING = "PLANNING",
    MEMORY = "MEMORY",
    LEARNING = "LEARNING",
    WORLD_MODEL = "WORLD_MODEL",
    SIMULATION = "SIMULATION",
    SCIENTIFIC_DISCOVERY = "SCIENTIFIC_DISCOVERY",
    HYPOTHESIS_GENERATION = "HYPOTHESIS_GENERATION",
    ENGINEERING = "ENGINEERING",
    ARCHITECTURE = "ARCHITECTURE",
    COORDINATION = "COORDINATION",
    COMMUNICATION = "COMMUNICATION",
    KNOWLEDGE = "KNOWLEDGE",
    TOOL_USAGE = "TOOL_USAGE",
    RESOURCE_MANAGEMENT = "RESOURCE_MANAGEMENT"
}

export interface DiagnosticEvidence {
    evidence_id: string;
    source: string;
    description: string;
    timestamp: number;
    metadata?: any;
}

export interface RootCause {
    cause_id: string;
    layer: DiagnosticLayer;
    description: string;
    is_root: boolean;
    confidence: number;
    evidence_ids: string[];
}

export interface CausalGraphNode {
    node_id: string;
    description: string;
    layer: DiagnosticLayer;
}

export interface CausalGraphEdge {
    source_id: string;
    target_id: string;
    relationship: "CAUSES" | "CONTRIBUTES_TO" | "MITIGATES";
}

export interface CausalGraph {
    graph_id: string;
    nodes: CausalGraphNode[];
    edges: CausalGraphEdge[];
    timestamp: number;
}

export interface DiagnosticConfidence {
    evidence_quality: number;
    data_completeness: number;
    historical_support: number;
    consistency: number;
    alternative_explanations: number;
    overall_confidence_score: number;
}

export interface FailureRecord {
    failure_id: string;
    mission_id: string;
    symptoms: string[];
    observed_evidence: DiagnosticEvidence[];
    immediate_cause: RootCause;
    root_cause: RootCause;
    contributing_factors: RootCause[];
    affected_modules: string[];
    confidence: DiagnosticConfidence;
    historical_similarity: number;
    recommended_actions: string[];
    resolution_status: "UNRESOLVED" | "IN_PROGRESS" | "RESOLVED";
    timestamp: number;
}

export interface SuccessRecord {
    success_id: string;
    mission_id: string;
    contributing_systems: string[];
    reasoning_path: string[];
    knowledge_used: string[];
    planning_strategy: string;
    learning_contribution: string;
    reusable_heuristics: string[];
    confidence: DiagnosticConfidence;
    benchmark_impact: number;
    timestamp: number;
}

export interface SystemicPattern {
    pattern_id: string;
    description: string;
    occurrences: number;
    affected_layers: DiagnosticLayer[];
    severity: number;
    detected_at: number;
}

export interface CounterfactualScenario {
    scenario_id: string;
    hypothesis: string;
    variables_changed: Record<string, any>;
    estimated_outcome: string;
    probability: number;
}

export interface RemediationRecommendation {
    recommendation_id: string;
    diagnosis_id: string;
    action_type: "LEARN_KNOWLEDGE" | "REUSE_CAPABILITY" | "ADJUST_POLICIES" | "IMPROVE_MEMORY" | "IMPROVE_PLANNER" | "IMPROVE_WORLD_MODEL" | "IMPROVE_ARCHITECTURE" | "LAUNCH_RESEARCH" | "LAUNCH_ENGINEERING_PROPOSAL" | "NO_ACTION";
    description: string;
    expected_impact: number;
    priority: number;
}

export interface KnowledgeGap {
    gap_id: string;
    domain: string;
    description: string;
    impact_on_mission: number;
}

export interface CapabilityGapReference {
    capability_id: string;
    required_level: number;
    current_level: number;
}

export interface CognitiveAutopsy {
    autopsy_id: string;
    mission_id: string;
    mission_goals: string[];
    inputs: any[];
    knowledge_retrieved: string[];
    reasoning_process: string[];
    planning_decisions: string[];
    tool_usage: string[];
    memory_access: string[];
    simulations_run: string[];
    decision_points: string[];
    execution_steps: string[];
    outcome: string;
    root_cause_analysis: CausalGraph;
    lessons_learned: string[];
    timestamp: number;
}

export interface DiagnosisReport {
    report_id: string;
    type: DiagnosisType;
    mission_id: string;
    autopsy?: CognitiveAutopsy;
    causal_graph?: CausalGraph;
    confidence: DiagnosticConfidence;
    recommendations: RemediationRecommendation[];
    timestamp: number;
}
