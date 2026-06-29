export enum ResearchStatus {
    DRAFT = "DRAFT",
    PROPOSED = "PROPOSED",
    ACTIVE = "ACTIVE",
    PEER_REVIEW = "PEER_REVIEW",
    COMPLETED = "COMPLETED",
    REJECTED = "REJECTED",
    ARCHIVED = "ARCHIVED"
}

export interface ResearchQuestion {
    question_id: string;
    objective: string;
    motivation: string;
    priority: number;
    dependencies: string[];
    expected_impact: number;
    measurable_success_criteria: string[];
    status: ResearchStatus;
    timestamp: number;
}

export interface ResearchHypothesis {
    hypothesis_id: string;
    question_id: string;
    statement: string;
    supporting_evidence: string[];
    competing_hypotheses: string[];
    expected_outcome: string;
    evaluation_plan: string;
    success_metrics: string[];
    confidence: number;
    status: ResearchStatus;
    timestamp: number;
}

export enum ExperimentStatus {
    PLANNED = "PLANNED",
    RUNNING = "RUNNING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED"
}

export interface Experiment {
    experiment_id: string;
    hypothesis_id: string;
    design: string;
    datasets: string[];
    configuration: Record<string, any>;
    status: ExperimentStatus;
    reproducibility_info: string;
    timestamp: number;
}

export interface ExperimentResult {
    result_id: string;
    experiment_id: string;
    outcomes: Record<string, any>;
    statistical_analysis: string;
    evidence_collected: ScientificEvidence[];
    conclusion: string;
    confidence: number;
    timestamp: number;
}

export enum TheoryStage {
    OBSERVATION = "OBSERVATION",
    HYPOTHESIS = "HYPOTHESIS",
    VALIDATED = "VALIDATED",
    THEORY = "THEORY",
    SCIENTIFIC_PRINCIPLE = "SCIENTIFIC_PRINCIPLE"
}

export interface ScientificTheory {
    theory_id: string;
    name: string;
    description: string;
    stage: TheoryStage;
    supporting_evidence: string[];
    contradictory_evidence: string[];
    confidence: number;
    revision_history: string[];
    timestamp: number;
}

export interface ScientificEvidence {
    evidence_id: string;
    source: string; // Paper, experiment, discovery
    claim: string;
    strength: number; // 0-100
    timestamp: number;
}

export interface AlgorithmCandidate {
    algorithm_id: string;
    name: string;
    category: string;
    description: string;
    evidence_id: string;
    performance_metrics: Record<string, number>;
    timestamp: number;
}

export interface TechnologyAssessment {
    technology_id: string;
    name: string;
    category: string;
    capability_assessment: string;
    maturity_level: number;
    integration_risk: number;
    expected_impact: number;
    timestamp: number;
}

export interface ResearchProgram {
    program_id: string;
    name: string;
    questions: string[];
    active_experiments: string[];
    status: ResearchStatus;
    timestamp: number;
}

export interface ResearchImpact {
    scientific_significance: number;
    expected_capability_improvement: number;
    engineering_complexity: number;
    research_maturity: number;
    implementation_cost: number;
    risk: number;
    cross_domain_applicability: number;
    roi: number;
}

export enum RecommendationAction {
    CONTINUE_RESEARCH = "CONTINUE_RESEARCH",
    REVISE_HYPOTHESIS = "REVISE_HYPOTHESIS",
    REPLICATE_EXPERIMENT = "REPLICATE_EXPERIMENT",
    LAUNCH_ARCHITECTURE_STUDY = "LAUNCH_ARCHITECTURE_STUDY",
    LAUNCH_ENGINEERING_PROPOSAL = "LAUNCH_ENGINEERING_PROPOSAL",
    ARCHIVE_RESEARCH = "ARCHIVE_RESEARCH",
    MERGE_RESEARCH_PROGRAMS = "MERGE_RESEARCH_PROGRAMS",
    NO_ACTION = "NO_ACTION"
}

export interface ResearchRecommendation {
    recommendation_id: string;
    hypothesis_id?: string;
    action: RecommendationAction;
    justification: string;
    impact: ResearchImpact;
    timestamp: number;
}

export interface ResearchReport {
    report_id: string;
    title: string;
    type: "SUMMARY" | "EXPERIMENT" | "THEORY" | "TECHNOLOGY" | "ALGORITHM";
    content: string;
    related_entities: string[];
    timestamp: number;
}

// Scientific Discovery Pipeline types
export interface SDPSession {
    session_id: string;
    question_id: string;
    hypothesis_id?: string;
    experiment_id?: string;
    result_id?: string;
    peer_review_feedback?: string[];
    final_conclusion?: string;
    stage: "OBSERVATION" | "QUESTION" | "HYPOTHESIS" | "LITERATURE_REVIEW" | "EXPERIMENT_DESIGN" | "SIMULATION" | "EXECUTION" | "ANALYSIS" | "PEER_REVIEW" | "CONCLUSION" | "THEORY_UPDATE" | "RECOMMENDATION";
}
