export enum GapType {
    KNOWLEDGE = "KNOWLEDGE",
    CAPABILITY = "CAPABILITY",
    ALGORITHM = "ALGORITHM",
    ARCHITECTURE = "ARCHITECTURE",
    POLICY = "POLICY",
    RESOURCE = "RESOURCE"
}

export interface BaseGap {
    gap_id: string;
    description: string;
    severity: number;
    detected_at: number;
}

export interface KnowledgeGap extends BaseGap {
    type: GapType.KNOWLEDGE;
    missing_domains: string[];
}

export interface CapabilityGap extends BaseGap {
    type: GapType.CAPABILITY;
    missing_ability: string;
}

export interface AlgorithmGap extends BaseGap {
    type: GapType.ALGORITHM;
    inefficient_algorithm: string;
}

export interface ArchitectureGap extends BaseGap {
    type: GapType.ARCHITECTURE;
    bottleneck_component: string;
}

export interface PolicyGap extends BaseGap {
    type: GapType.POLICY;
    suboptimal_rule: string;
}

export interface ResourceGap extends BaseGap {
    type: GapType.RESOURCE;
    constrained_resource: string;
}

export type AnyGap = KnowledgeGap | CapabilityGap | AlgorithmGap | ArchitectureGap | PolicyGap | ResourceGap;

export interface CapabilityDependency {
    source_capability_id: string;
    target_capability_id: string;
    relationship: "REQUIRES" | "OPTIONAL" | "CONFLICTS_WITH";
}

export interface CapabilityGenome {
    genome_id: string;
    capability_id: string;
    purpose: string;
    problem_solved: string;
    creation_reason: string;
    dependencies: string[];
    knowledge_requirements: string[];
    algorithms: string[];
    architecture_location: string;
    benchmarks: string[];
    performance_history: any[];
    evolution_history: string[];
    replacement_history: string[];
    retirement_status: "ACTIVE" | "RETIRED" | "DEPRECATED";
    timestamp: number;
}

export interface Capability {
    capability_id: string;
    name: string;
    purpose: string;
    inputs: string[];
    outputs: string[];
    dependencies: string[];
    supported_domains: string[];
    complexity: number;
    historical_effectiveness: number;
    benchmark_impact: number;
    owner_division: string;
    genome: CapabilityGenome;
}

export interface CapabilityImpactPrediction {
    prediction_id: string;
    reasoning_improvement: number;
    planning_improvement: number;
    memory_improvement: number;
    research_improvement: number;
    coding_improvement: number;
    simulation_improvement: number;
    scientific_reasoning_improvement: number;
    overall_cognitive_improvement: number;
    confidence: number;
    timestamp: number;
}

export interface CapabilityProposal {
    proposal_id: string;
    name: string;
    purpose: string;
    expected_benefit: number;
    affected_domains: string[];
    interfaces: string[];
    dependencies: string[];
    estimated_implementation_effort: number;
    benchmark_impact: number;
    risk: number;
    validation_strategy: string;
    confidence: number;
    roi: number;
    impact_prediction: CapabilityImpactPrediction;
}

export interface GapAssessment {
    assessment_id: string;
    gaps: AnyGap[];
    mission_id: string;
    timestamp: number;
}

export enum InterventionType {
    LEARN_NEW_KNOWLEDGE = "LEARN_NEW_KNOWLEDGE",
    EXPAND_EXPERIENCE = "EXPAND_EXPERIENCE",
    REUSE_EXISTING_CAPABILITY = "REUSE_EXISTING_CAPABILITY",
    OPTIMIZE_ALGORITHM = "OPTIMIZE_ALGORITHM",
    UPDATE_POLICY = "UPDATE_POLICY",
    REFACTOR_ARCHITECTURE = "REFACTOR_ARCHITECTURE",
    CREATE_NEW_CAPABILITY = "CREATE_NEW_CAPABILITY",
    COMBINE_EXISTING_CAPABILITIES = "COMBINE_EXISTING_CAPABILITIES",
    NO_ACTION = "NO_ACTION"
}

export interface InterventionScore {
    intervention_type: InterventionType;
    score: number;
    expected_gain: number;
    cost: number;
    risk: number;
    justification: string;
}

export interface CEDMResult {
    scores: InterventionScore[];
    selected_intervention: InterventionScore;
}

export interface EvolutionRecommendation {
    recommendation_id: string;
    assessment_id: string;
    action_type: InterventionType;
    target_capability_id?: string;
    proposal?: CapabilityProposal;
    cedm_result: CEDMResult;
    supporting_evidence: string[];
    priority: number;
    timestamp: number;
}

export interface CapabilityRoadmap {
    roadmap_id: string;
    immediate_improvements: EvolutionRecommendation[];
    near_term_improvements: EvolutionRecommendation[];
    mid_term_improvements: EvolutionRecommendation[];
    long_term_improvements: EvolutionRecommendation[];
    research_dependencies: string[];
    engineering_milestones: string[];
    expected_benchmark_gains: Record<string, number>;
    timestamp: number;
}

export interface GapMetrics {
    total_gaps_detected: number;
    knowledge_gaps: number;
    capability_gaps: number;
    capabilities_reused: number;
    new_capabilities_proposed: number;
    average_roi: number;
}
