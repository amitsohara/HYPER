export enum NodeType {
    MISSION = "MISSION",
    ENTITY = "ENTITY",
    PERSON = "PERSON",
    ORGANIZATION = "ORGANIZATION",
    RESOURCE = "RESOURCE",
    SYSTEM = "SYSTEM",
    CONSTRAINT = "CONSTRAINT",
    ASSUMPTION = "ASSUMPTION",
    EVIDENCE = "EVIDENCE",
    BELIEF = "BELIEF",
    GOAL = "GOAL",
    RISK = "RISK",
    DECISION = "DECISION",
    ACTION = "ACTION",
    OUTCOME = "OUTCOME",
    PATTERN = "PATTERN",
    HEURISTIC = "HEURISTIC",
    CAUSAL_FACTOR = "CAUSAL_FACTOR",
    WORLD_STATE = "WORLD_STATE",
    SCENARIO = "SCENARIO",
    PREDICTION = "PREDICTION",
    EXPERIENCE = "EXPERIENCE",
    SKILL = "SKILL",
    STRATEGY = "STRATEGY",
    CONCEPT = "CONCEPT",
    UNKNOWN = "UNKNOWN"
}

export enum EdgeType {
    DEPENDS_ON = "DEPENDS_ON",
    CAUSES = "CAUSES",
    INCREASES = "INCREASES",
    DECREASES = "DECREASES",
    ENABLES = "ENABLES",
    BLOCKS = "BLOCKS",
    SUPPORTS = "SUPPORTS",
    CONTRADICTS = "CONTRADICTS",
    REQUIRES = "REQUIRES",
    TRANSFORMS = "TRANSFORMS",
    PREDICTS = "PREDICTS",
    EXPLAINS = "EXPLAINS",
    LEADS_TO = "LEADS_TO",
    DERIVED_FROM = "DERIVED_FROM",
    SIMILAR_TO = "SIMILAR_TO",
    TRANSFERRED_FROM = "TRANSFERRED_FROM",
    USES = "USES",
    IMPROVES = "IMPROVES",
    WEAKENS = "WEAKENS"
}

export interface WorkspaceNode {
    id: string;
    type: NodeType;
    label: string;
    properties: Record<string, any>;
    confidence: number;
    provenance: string[]; // Modules that contributed to this node
    created_at: number;
    updated_at: number;
}

export interface WorkspaceEdge {
    id: string;
    source: string;
    target: string;
    type: EdgeType;
    properties: Record<string, any>;
    confidence: number;
    provenance: string[];
    created_at: number;
    updated_at: number;
}

export interface WorkspaceGraph {
    nodes: Map<string, WorkspaceNode>;
    edges: Map<string, WorkspaceEdge>;
}

export interface WorkspacePatch {
    patch_id: string;
    workspace_id: string;
    module_name: string;
    step_name: string;
    timestamp: number;
    
    nodes_added: WorkspaceNode[];
    nodes_updated: WorkspaceNode[];
    nodes_removed: string[];
    
    edges_added: WorkspaceEdge[];
    edges_updated: WorkspaceEdge[];
    edges_removed: string[];
    
    confidence_delta?: number;
    uncertainty_delta?: number;
    
    affected_nodes: string[];
    affected_edges: string[];
    reason: string;
}

export interface WorkspaceSnapshot {
    snapshot_id: string;
    workspace_id: string;
    timestamp: number;
    reason: string;
    graph: WorkspaceGraph;
    confidence: number;
    uncertainty: number;
}

export interface WorkspaceState {
    workspace_id: string;
    mission_id: string;
    mission: string;
    created_at: number;
    updated_at: number;
    status: 'active' | 'completed' | 'archived';

    graph: WorkspaceGraph;
    
    // We can extract specific subgraphs dynamically, but we keep the main graph here.
    // The prompt requested specific graphs (mission_graph, etc.).
    // For a unified graph, all nodes/edges are in `graph`, and we query by node type or sub-graph logic.

    world_state: any;
    world_model?: { real_world?: any; imagined_world?: any; }; // To hold the HWME world model
    dynamic_world?: any; // DWSE WorldStateManager
    processes?: {
        models: any[];
        active_instances: any[];
        completed_instances: any[];
        failed_instances: any[];
        process_graph?: any;
    };
    mechanisms?: {
        models: any[];
        mechanism_graph: any;
        active_mechanisms: any[];
        discovered_mechanisms: any[];
    };
    principles?: {
        models: any[];
        principle_graph: any;
        principle_candidates: any[];
        validated_principles: any[];
    };
    hypotheses?: {
        models: any[];
        active_hypotheses: any[];
        rejected_hypotheses: any[];
        validated_hypotheses: any[];
        experiments: any[];
        evidence: any[];
    };
    research?: {
        knowledge_gaps: any[];
        research_questions: any[];
        research_plan: any[];
        active_research: any[];
        completed_research: any[];
        discovery_queue: any[];
    };
    simulations?: {
        simulations: any[];
        simulation_branches: any[];
        discovery_candidates: any[];
        best_solutions: any[];
        virtual_worlds: any[];
    };
    hcos_orchestrator?: {
        active_sessions: any[];
        completed_sessions: any[];
    };
    hsee_evolution?: {
        active_policies: any[];
        improvement_history: any[];
        benchmarks: any[];
    };
    imagined_world: any;
    simulation_state: any;
    discovery_state: any;

    active_focus: string;
    attention_weights: Record<string, number>;

    confidence: number;
    uncertainty: number;

    modules_contributed: string[];
    events: any[];
    snapshots: WorkspaceSnapshot[];
    patches: WorkspacePatch[];
    version: number;
}
