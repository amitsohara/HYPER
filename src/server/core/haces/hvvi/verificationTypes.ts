import { v4 as uuidv4 } from "uuid";

export enum VerificationLayer {
    TRACEABILITY = "TRACEABILITY",
    FUNCTIONAL = "FUNCTIONAL",
    ARCHITECTURE = "ARCHITECTURE",
    SCIENTIFIC = "SCIENTIFIC",
    SECURITY = "SECURITY",
    PERFORMANCE = "PERFORMANCE",
    REGRESSION = "REGRESSION",
    RELIABILITY = "RELIABILITY",
    DOCUMENTATION = "DOCUMENTATION"
}

export enum ApprovalStatus {
    APPROVED = "APPROVED",
    APPROVED_WITH_CONDITIONS = "APPROVED_WITH_CONDITIONS",
    REQUIRES_REWORK = "REQUIRES_REWORK",
    REJECTED = "REJECTED",
    DEFERRED = "DEFERRED"
}

export interface TraceabilityRecord {
    mission_id: string;
    observation_id?: string;
    diagnosis_id?: string;
    gap_id?: string;
    research_id?: string;
    architecture_id?: string;
    engineering_id: string;
    is_traceable: boolean;
    missing_links: string[];
}

export interface FunctionalAssessment {
    feature_completeness: number; // 0-100
    interface_correctness: number;
    edge_cases_handled: boolean;
    failure_handling: boolean;
    issues: string[];
}

export interface ArchitectureAssessment {
    blueprint_followed: boolean;
    interface_contracts_met: boolean;
    dependency_violations: string[];
    deviations: string[];
}

export interface ScientificAssessment {
    hypothesis_aligned: boolean;
    research_evidence_supported: boolean;
    deviations: string[];
}

export interface SecurityAssessment {
    vulnerabilities_found: string[];
    secrets_exposed: boolean;
    owasp_aligned: boolean;
    passed: boolean;
}

export interface PerformanceAssessment {
    latency_ms: number;
    throughput_req_sec: number;
    cpu_utilization: number;
    memory_mb: number;
    meets_expectations: boolean;
}

export interface RegressionAssessment {
    functional_regressions: string[];
    performance_regressions: string[];
    security_regressions: string[];
    passed: boolean;
}

export interface ReliabilityAssessment {
    fault_tolerance_score: number; // 0-100
    recovery_time_ms: number;
    passed: boolean;
}

export interface DocumentationAssessment {
    api_docs_present: boolean;
    developer_docs_present: boolean;
    synchronized: boolean;
    issues: string[];
}

export interface VerificationReport {
    report_id: string;
    engineering_id: string;
    timestamp: number;
    traceability: TraceabilityRecord;
    functional: FunctionalAssessment;
    architecture: ArchitectureAssessment;
    scientific: ScientificAssessment;
    security: SecurityAssessment;
    performance: PerformanceAssessment;
    regression: RegressionAssessment;
    reliability: ReliabilityAssessment;
    documentation: DocumentationAssessment;
}

export interface EngineeringCertification {
    certification_id: string;
    engineering_id: string;
    timestamp: number;
    scores: {
        functional_correctness: number;
        architecture_compliance: number;
        scientific_consistency: number;
        security: number;
        performance: number;
        reliability: number;
        maintainability: number;
        documentation: number;
        testing_quality: number;
    };
    overall_confidence: number; // 0-100
    trend: 'UP' | 'DOWN' | 'STABLE';
    contributing_factors: string[];
}

export interface ApprovalDecision {
    decision_id: string;
    engineering_id: string;
    certification_id: string;
    status: ApprovalStatus;
    conditions: string[];
    reasons: string[];
    timestamp: number;
}
