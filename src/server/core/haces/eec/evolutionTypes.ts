export enum EvolutionStage {
    IDLE = "IDLE",
    OBSERVING = "OBSERVING",
    ASSESSING = "ASSESSING",
    DECISION = "DECISION",
    RESEARCH = "RESEARCH",
    DESIGN = "DESIGN",
    ENGINEERING = "ENGINEERING",
    VERIFICATION = "VERIFICATION",
    BENCHMARK = "BENCHMARK",
    SANDBOX = "SANDBOX",
    APPROVAL = "APPROVAL",
    DEPLOYMENT = "DEPLOYMENT",
    LEARNING = "LEARNING",
    COMPLETE = "COMPLETE",
    REJECTED = "REJECTED",
    FAILED = "FAILED",
    ROLLED_BACK = "ROLLED_BACK"
}

export enum EvolutionDecision {
    NO_ACTION = "NO_ACTION",
    LEARN_ONLY = "LEARN_ONLY",
    UPDATE_EXPERIENCE = "UPDATE_EXPERIENCE",
    UPDATE_KNOWLEDGE = "UPDATE_KNOWLEDGE",
    UPDATE_POLICIES = "UPDATE_POLICIES",
    RECONFIGURE_EXISTING_MODULES = "RECONFIGURE_EXISTING_MODULES",
    LAUNCH_RESEARCH = "LAUNCH_RESEARCH",
    LAUNCH_ARCHITECTURE_INVESTIGATION = "LAUNCH_ARCHITECTURE_INVESTIGATION",
    LAUNCH_ENGINEERING = "LAUNCH_ENGINEERING",
    REJECT_EVOLUTION = "REJECT_EVOLUTION"
}

export interface EvolutionProposal {
    proposal_id: string;
    mission_id: string;
    problem_definition: string;
    observed_evidence: string[];
    measurable_impact: string;
    expected_improvement: string;
    affected_cognitive_systems: string[];
    required_resources: ResourceAllocation;
    estimated_engineering_effort: number;
    validation_strategy: string;
    rollback_strategy: string;
    risk_assessment?: RiskAssessment;
    priority_score?: PriorityScore;
    ejs?: number; // Evolution Justification Score
    stage: EvolutionStage;
    created_at: number;
    updated_at: number;
}

export interface ResourceAllocation {
    compute_budget: number;
    token_budget: number;
    engineering_budget: number;
    simulation_budget: number;
    benchmarking_budget: number;
    research_budget: number;
    storage_budget: number;
}

export interface RiskAssessment {
    technical_risk_score: number;
    regression_risk: number;
    compatibility_risk: number;
    safety_risk: number;
    architectural_risk: number;
    confidence_estimate: number;
    overall_risk_score: number;
}

export interface PriorityScore {
    expected_capability_improvement: number;
    mission_frequency: number;
    severity: number;
    safety_impact: number;
    implementation_cost: number;
    engineering_effort: number;
    compute_budget: number;
    strategic_importance: number;
    long_term_value: number;
    overall_priority_score: number;
}

export interface EvolutionMetrics {
    total_proposals: number;
    approved_proposals: number;
    rejected_proposals: number;
    average_ejs: number;
    resources_consumed: ResourceAllocation;
}

export interface ExecutiveReport {
    report_id: string;
    proposal_id: string;
    decision: EvolutionDecision;
    justification: string;
    affected_modules: string[];
    expected_benefit: string;
    risks: RiskAssessment;
    required_resources: ResourceAllocation;
    current_lifecycle_stage: EvolutionStage;
    approval_status: string;
    timestamp: number;
}
