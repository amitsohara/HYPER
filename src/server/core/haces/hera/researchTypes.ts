export enum ResearchStatus {
    PROPOSED = "PROPOSED",
    ACTIVE = "ACTIVE",
    PAUSED = "PAUSED",
    COMPLETED = "COMPLETED",
    ARCHIVED = "ARCHIVED",
    REJECTED = "REJECTED"
}

export enum ResearchCategory {
    REASONING = "REASONING",
    PLANNING = "PLANNING",
    MEMORY = "MEMORY",
    CODING = "CODING",
    PERCEPTION = "PERCEPTION",
    SCIENTIFIC_REASONING = "SCIENTIFIC_REASONING",
    CREATIVITY = "CREATIVITY",
    SIMULATION = "SIMULATION",
    HYPOTHESIS_GENERATION = "HYPOTHESIS_GENERATION",
    ROBOTICS = "ROBOTICS",
    MATHEMATICS = "MATHEMATICS",
    LONG_CONTEXT = "LONG_CONTEXT",
    WORLD_MODELING = "WORLD_MODELING"
}

export enum ResearchHorizon {
    SHORT_TERM = "SHORT_TERM",
    MID_TERM = "MID_TERM",
    LONG_TERM = "LONG_TERM"
}

export interface ResearchHypothesis {
    question: string;
    hypothesis: string;
    supporting_evidence: string[];
    evaluation_plan: string;
    success_criteria: string[];
    estimated_cost: {
        compute: number;
        engineering_effort: number;
        time_days: number;
    };
    expected_capability_gain: Record<string, number>;
    decision?: "CONFIRMED" | "REVISED" | "REJECTED";
}

export interface ResearchInitiative {
    initiative_id: string;
    title: string;
    description: string;
    category: ResearchCategory;
    priority: number;
    expected_impact: number;
    status: ResearchStatus;
    dependencies: string[];
    owner_division: string;
    benchmark_targets: string[];
    completion_criteria: string[];
    hypothesis: ResearchHypothesis;
    created_at: number;
    updated_at: number;
}

export interface WeaknessAssessment {
    assessment_id: string;
    category: ResearchCategory;
    description: string;
    severity: number;
    observed_frequency: number;
    impact_on_missions: number;
    detected_at: number;
}

export interface CapabilityGap {
    category: ResearchCategory;
    current_score: number;
    potential_score: number;
    gap: number;
    research_priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
}

export interface IntelligencePotentialProfile {
    profile_id: string;
    timestamp: number;
    gaps: CapabilityGap[];
}

export interface TechnologyAssessment {
    technology_id: string;
    name: string;
    description: string;
    potential_impact: number;
    readiness_level: number;
    evaluation_status: "PENDING" | "EVALUATING" | "ADOPTED" | "REJECTED";
}

export interface ResearchOpportunity {
    opportunity_id: string;
    source: string;
    description: string;
    technology?: TechnologyAssessment;
    estimated_roi: number;
}

export interface RoadmapItem {
    item_id: string;
    horizon: ResearchHorizon;
    objective: string;
    expected_capability_gain: number;
    dependencies: string[];
    estimated_effort: number;
    measurable_success_criteria: string[];
    review_schedule: number;
}

export interface GrandChallenge {
    challenge_id: string;
    title: string;
    description: string;
    current_progress: number;
    target_milestones: string[];
    active: boolean;
}

export interface ResearchInvestment {
    initiative_id: string;
    expected_capability_gain: number;
    strategic_importance: number;
    mission_frequency: number;
    engineering_cost: number;
    research_cost: number;
    risk: number;
    long_term_value: number;
    compute_cost: number;
    roi: number;
}

export enum RecommendationType {
    CONTINUE_RESEARCH = "CONTINUE_RESEARCH",
    PAUSE = "PAUSE",
    CANCEL = "CANCEL",
    INCREASE_INVESTMENT = "INCREASE_INVESTMENT",
    LAUNCH_ARCHITECTURE_STUDY = "LAUNCH_ARCHITECTURE_STUDY",
    LAUNCH_BENCHMARK_STUDY = "LAUNCH_BENCHMARK_STUDY",
    LAUNCH_ENGINEERING_PROPOSAL = "LAUNCH_ENGINEERING_PROPOSAL",
    MERGE_RESEARCH = "MERGE_RESEARCH",
    ARCHIVE = "ARCHIVE"
}

export interface StrategicRecommendation {
    recommendation_id: string;
    initiative_id?: string;
    type: RecommendationType;
    justification: string;
    expected_benefit: number;
    created_at: number;
}

export interface AnnualResearchReport {
    report_id: string;
    timestamp: number;
    current_intelligence_profile: IntelligencePotentialProfile;
    largest_weaknesses: WeaknessAssessment[];
    highest_opportunities: ResearchOpportunity[];
    research_priorities: ResearchInitiative[];
    capability_trends: any;
    emerging_technologies: TechnologyAssessment[];
    benchmark_comparisons: any;
    future_milestones: RoadmapItem[];
    strategic_recommendations: StrategicRecommendation[];
}

export interface ResearchMetrics {
    active_initiatives: number;
    completed_initiatives: number;
    total_investment_roi: number;
    grand_challenges_active: number;
    identified_weaknesses: number;
}
