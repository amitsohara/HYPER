export enum BlueprintStatus {
    DRAFT = "DRAFT",
    REVIEW = "REVIEW",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    IMPLEMENTED = "IMPLEMENTED"
}

export interface CognitiveBlueprint {
    blueprint_id: string;
    version: string;
    mission: string;
    functional_objectives: string[];
    cognitive_responsibilities: string[];
    inputs: string[];
    outputs: string[];
    internal_reasoning_workflow: string;
    data_flow: string;
    decision_flow: string;
    control_flow: string;
    state_transitions: string[];
    dependencies: string[];
    external_interfaces: string[];
    internal_interfaces: string[];
    performance_expectations: Record<string, string>;
    scalability_strategy: string;
    safety_constraints: string[];
    rollback_strategy: string;
    evolution_path: string;
    status: BlueprintStatus;
    timestamp: number;
}

export interface ArchitectureProposal {
    proposal_id: string;
    name: string;
    capability_id: string;
    scientific_evidence_id: string;
    alternatives: ArchitectureAlternative[];
    selected_alternative_id?: string;
    timestamp: number;
}

export interface ArchitectureAlternative {
    alternative_id: string;
    description: string;
    patterns_used: string[];
    performance_estimate: number;
    complexity_score: number;
    maintainability_score: number;
    scalability_score: number;
    reliability_score: number;
    safety_score: number;
    engineering_effort_estimate: number;
    expected_benchmark_gain: number;
}

export interface ArchitectureDecision {
    decision_id: string;
    proposal_id: string;
    selected_alternative_id: string;
    justification: string;
    tradeoffs_accepted: string[];
    timestamp: number;
}

export interface ArchitecturePattern {
    pattern_id: string;
    name: string;
    description: string;
    advantages: string[];
    disadvantages: string[];
    typical_use_cases: string[];
    known_limitations: string[];
    benchmark_performance: string;
}

export interface ArchitectureGenome {
    genome_id: string;
    element_id: string;
    type: "MODULE" | "PIPELINE" | "SYSTEM";
    creation_reason: string;
    scientific_evidence: string[];
    research_references: string[];
    capability_supported: string;
    interfaces: string[];
    dependencies: string[];
    version_history: string[];
    benchmark_improvements: string[];
    replacement_history: string[];
    retirement_history: string[];
    timestamp: number;
}

export interface InterfaceSpecification {
    spec_id: string;
    name: string;
    inputs: any[];
    outputs: any[];
    contracts: string[];
    schemas: string[];
    events: string[];
    error_handling: string;
    versioning: string;
    security_requirements: string[];
    performance_guarantees: string;
}

export interface DependencyGraph {
    graph_id: string;
    nodes: string[];
    edges: Array<{ source: string; target: string; type: "REQUIRED" | "OPTIONAL" | "CONFLICT" }>;
    version_compatibility: Record<string, string>;
}

export interface WorkflowDefinition {
    workflow_id: string;
    name: string;
    type: string;
    steps: string[];
    transitions: Record<string, string>;
    fallback_mechanisms: string[];
}

export interface ArchitectureSimulation {
    simulation_id: string;
    blueprint_id: string;
    reasoning_impact_estimate: number;
    latency_estimate_ms: number;
    memory_consumption_estimate_mb: number;
    scalability_limit: string;
    failure_probability: number;
    resource_utilization: number;
    future_extensibility_score: number;
}

export interface ArchitectureRisk {
    risk_id: string;
    technical_risk_score: number;
    architectural_complexity: number;
    coupling_score: number;
    failure_propagation_risk: number;
    scalability_bottlenecks: string[];
    operational_risk: number;
    maintainability_risk: number;
    evolution_risk: number;
    mitigation_plans: string[];
}

export interface EngineeringPackage {
    package_id: string;
    blueprint: CognitiveBlueprint;
    architecture_diagrams: string[];
    dependency_graph: DependencyGraph;
    interface_specifications: InterfaceSpecification[];
    event_definitions: string[];
    data_models: string[];
    state_machines: string[];
    sequence_diagrams: string[];
    testing_requirements: string[];
    verification_requirements: string[];
    benchmark_expectations: Record<string, number>;
    rollback_procedures: string[];
    timestamp: number;
}
