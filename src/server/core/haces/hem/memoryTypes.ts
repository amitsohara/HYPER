import { v4 as uuidv4 } from "uuid";

export enum EvolutionEventType {
    OBSERVATION = "OBSERVATION",
    DIAGNOSIS = "DIAGNOSIS",
    CAPABILITY_GAP = "CAPABILITY_GAP",
    RESEARCH = "RESEARCH",
    ARCHITECTURE = "ARCHITECTURE",
    ENGINEERING = "ENGINEERING",
    VERIFICATION = "VERIFICATION",
    BENCHMARK = "BENCHMARK",
    SANDBOX = "SANDBOX",
    PROMOTION = "PROMOTION",
    PRODUCTION_EVOLUTION = "PRODUCTION_EVOLUTION",
    ROLLBACK = "ROLLBACK",
    RETIREMENT = "RETIREMENT"
}

export interface EvolutionEvent {
    event_id: string;
    type: EvolutionEventType;
    timestamp: number;
    mission_id?: string;
    payload: any;
    version: string;
    metadata: {
        source_module: string;
        confidence?: number;
    };
}

export interface EvolutionHistory {
    history_id: string;
    events: EvolutionEvent[];
}

export interface NodeMetadata {
    type: 'MISSION' | 'OBSERVATION' | 'DIAGNOSIS' | 'GAP' | 'RESEARCH' | 'ARCHITECTURE' | 'ENGINEERING' | 'VERIFICATION' | 'BENCHMARK' | 'SANDBOX' | 'DECISION' | 'PRODUCTION' | 'OUTCOME';
    timestamp: number;
    data: any;
}

export interface GraphNode {
    id: string;
    metadata: NodeMetadata;
}

export interface GraphEdge {
    source_id: string;
    target_id: string;
    relationship: 'LEADS_TO' | 'RESOLVES' | 'VERIFIES' | 'IMPLEMENTS' | 'EVALUATES' | 'CAUSES';
    weight?: number;
}

export interface EvolutionKnowledgeGraphData {
    nodes: Map<string, GraphNode>;
    edges: GraphEdge[];
}

export interface KnowledgeArtifact {
    artifact_id: string;
    category: 'ALGORITHM' | 'ARCHITECTURE' | 'CAPABILITY' | 'POLICY' | 'ENGINEERING_PRACTICE' | 'RESEARCH_PROGRAM' | 'TRADE_OFF';
    content: string;
    rationale: string;
    evidence_links: string[]; // Links to event IDs or node IDs
    timestamp: number;
}

export interface EvolutionLesson {
    lesson_id: string;
    type: 'SUCCESS' | 'FAILURE' | 'STRATEGY' | 'PRINCIPLE';
    description: string;
    context: string;
    causal_chain_ids: string[];
    timestamp: number;
}

export interface InstitutionalKnowledge {
    knowledge_id: string;
    artifacts: KnowledgeArtifact[];
    lessons: EvolutionLesson[];
}

export interface DecisionRecord {
    decision_id: string;
    decision_maker: string; // Module or agent
    timestamp: number;
    description: string;
    alternatives_considered: string[];
    supporting_evidence: string[]; // Event IDs
    risks: string[];
    expected_benefits: string[];
    confidence: number;
    outcome?: 'SUCCESS' | 'FAILURE' | 'PARTIAL' | 'PENDING';
    long_term_evaluation?: string;
}

export interface CausalRelationship {
    causal_id: string;
    cause_id: string; // Event or Artifact ID
    effect_id: string; // Event or Artifact ID
    relationship_type: 'IMPROVES' | 'DEGRADES' | 'ENABLES' | 'PREVENTS';
    confidence: number;
    evidence: string[];
}

export interface ReflectionReport {
    report_id: string;
    timestamp: number;
    cycle_id: string;
    what_happened: string;
    why: string;
    what_worked: string;
    what_failed: string;
    unexpected_outcomes: string;
    lessons_learned: string[];
    recommendations: string[];
    future_research_questions: string[];
}

export interface EvolutionNarrative {
    narrative_id: string;
    topic: string;
    timestamp: number;
    content: string;
    audience: 'HUMAN' | 'MACHINE';
    source_events: string[];
}

export interface CapabilityHistory {
    capability_name: string;
    lineage_events: EvolutionEvent[];
}

export interface ArchitectureHistory {
    architecture_name: string;
    lineage_events: EvolutionEvent[];
}

export interface EngineeringHistory {
    module_name: string;
    lineage_events: EvolutionEvent[];
}
