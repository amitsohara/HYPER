import { v4 as uuidv4 } from "uuid";

export enum CapabilityCategory {
    REASONING = "REASONING",
    PLANNING = "PLANNING",
    MEMORY = "MEMORY",
    KNOWLEDGE = "KNOWLEDGE",
    SCIENTIFIC_DISCOVERY = "SCIENTIFIC_DISCOVERY",
    SOFTWARE_ENGINEERING = "SOFTWARE_ENGINEERING",
    MATHEMATICS = "MATHEMATICS",
    PROGRAMMING = "PROGRAMMING",
    SIMULATION = "SIMULATION",
    DECISION_MAKING = "DECISION_MAKING",
    VISION = "VISION",
    LANGUAGE = "LANGUAGE",
    TOOL_USE = "TOOL_USE",
    MULTI_AGENT_COLLABORATION = "MULTI_AGENT_COLLABORATION",
    LONG_TERM_PLANNING = "LONG_TERM_PLANNING",
    CREATIVITY = "CREATIVITY",
    SAFETY = "SAFETY",
    GENERAL_INTELLIGENCE = "GENERAL_INTELLIGENCE"
}

export interface Benchmark {
    benchmark_id: string;
    name: string;
    purpose: string;
    difficulty: number; // 1-100
    required_capabilities: CapabilityCategory[];
    historical_results: BenchmarkResult[];
    version: string;
    expected_behavior: string;
    status: 'ACTIVE' | 'RETIRED' | 'EXPERIMENTAL';
}

export interface BenchmarkSuite {
    suite_id: string;
    name: string;
    benchmarks: Benchmark[];
    target_capabilities: CapabilityCategory[];
}

export interface BenchmarkResult {
    result_id: string;
    benchmark_id: string;
    timestamp: number;
    score: number; // 0-100
    execution_time_ms: number;
    passed: boolean;
    evidence: string[];
    version_evaluated: string;
}

export interface CapabilityScore {
    category: CapabilityCategory;
    score: number; // 0-100
    confidence: number; // 0-100
    trend: 'UP' | 'DOWN' | 'STABLE';
    contributing_benchmarks: string[];
}

export interface IntelligenceProfile {
    version: string;
    timestamp: number;
    capabilities: Record<CapabilityCategory, CapabilityScore>;
    continuous_intelligence_index: number; // The CII score
}

export interface IntelligencePassport {
    passport_id: string;
    version: string;
    issue_date: number;
    profile: IntelligenceProfile;
    general_intelligence_index: number;
    safety_certification_score: number;
}

export interface RegressionAnalysis {
    analysis_id: string;
    timestamp: number;
    base_version: string;
    target_version: string;
    regressions_detected: { category: CapabilityCategory; severity: 'LOW'|'MEDIUM'|'HIGH'; description: string }[];
    improvements_detected: { category: CapabilityCategory; description: string }[];
    statistical_confidence: number;
}

export interface StatisticalValidation {
    validation_id: string;
    result_id: string;
    variance: number;
    confidence_interval: [number, number];
    is_significant: boolean;
    p_value: number;
    reproducibility_score: number;
}

export interface GeneralizationAssessment {
    assessment_id: string;
    version: string;
    cross_domain_transfer_score: number;
    task_generalization_score: number;
    overfitting_detected: boolean;
    evidence: string[];
}

export interface BenchmarkRecommendation {
    recommendation_id: string;
    action: 'RETIRE' | 'CREATE' | 'INCREASE_DIFFICULTY' | 'EXPAND_COVERAGE' | 'MERGE' | 'CREATE_ADVERSARIAL';
    target_benchmark_id?: string;
    reasoning: string;
}

export interface BenchmarkGenome {
    genome_id: string;
    benchmark_id: string;
    purpose: string;
    capability_coverage: CapabilityCategory[];
    difficulty_trend: number[];
    failure_modes: string[];
    bias_analysis: string;
    generalization_score: number;
    retirement_history?: string;
}

export interface IntelligenceTrend {
    period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'ANNUAL' | 'GENERATIONAL';
    start_time: number;
    end_time: number;
    cii_start: number;
    cii_end: number;
    growth_rate: number;
    forecasted_cii: number;
}

export interface ExecutiveBenchmarkReport {
    report_id: string;
    timestamp: number;
    version: string;
    cii_score: number;
    key_improvements: string[];
    key_regressions: string[];
    passport_id: string;
    summary: string;
}
