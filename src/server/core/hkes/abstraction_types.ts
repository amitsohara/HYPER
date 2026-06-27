export enum AbstractionType {
    LESSON = 'LESSON',
    PATTERN = 'PATTERN',
    SKILL = 'SKILL',
    STRATEGY = 'STRATEGY',
    PRINCIPLE = 'PRINCIPLE',
    MENTAL_MODEL = 'MENTAL_MODEL',
    CONCEPT = 'CONCEPT',
    HEURISTIC = 'HEURISTIC',
    CAUSAL_MODEL = 'CAUSAL_MODEL'
}

export interface Abstraction {
    abstraction_id: string;
    abstraction_type: AbstractionType;
    title: string;
    description: string;
    source_experience_ids: string[];
    source_domains: string[];
    confidence: number;
    support_count: number;
    contradiction_count: number;
    transferability: number;
    evidence_strength: number;
    created_at: number;
    updated_at: number;
    version: number;
}

export interface PatternAbstraction extends Abstraction {
    abstraction_type: AbstractionType.PATTERN;
    pattern_category: string;
    source_mission_types: string[];
    recurring_conditions: string[];
    recurring_actions: string[];
    recurring_outcomes: string[];
    recurring_failures: string[];
    recurring_success_factors: string[];
}

export interface HeuristicAbstraction extends Abstraction {
    abstraction_type: AbstractionType.HEURISTIC;
    if_conditions: string[];
    then_guidance: string[];
    avoid_when: string[];
    failure_warning: string[];
    source_pattern_ids: string[];
    applicable_domains: string[];
    mission_types: string[];
    applicability_score: number;
}

export interface CausalNode {
    id: string;
    label: string;
    type: string;
    description: string;
}

export interface CausalEdge {
    source: string;
    target: string;
    relationship: 'causes' | 'increases' | 'decreases' | 'enables' | 'blocks' | 'moderates' | 'mediates' | 'depends_on' | 'triggers' | 'prevents';
    direction: 'forward' | 'bidirectional';
    strength: number;
    evidence: string;
    confidence: number;
}

export interface CausalModelAbstraction extends Abstraction {
    abstraction_type: AbstractionType.CAUSAL_MODEL;
    source_pattern_ids: string[];
    source_heuristic_ids: string[];
    applicable_domains: string[];
    mission_types: string[];
    
    causal_nodes: CausalNode[];
    causal_edges: CausalEdge[];
    
    root_causes: string[];
    mediators: string[];
    moderators: string[];
    outcomes: string[];
    
    interventions: Array<{
        intervention: string;
        target_node: string;
        expected_effect: string;
        risks: string;
        confidence: number;
    }>;
    failure_modes: string[];
    causal_strength: number;
}


