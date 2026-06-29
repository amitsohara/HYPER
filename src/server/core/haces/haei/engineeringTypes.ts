export enum TaskStatus {
    PENDING = "PENDING",
    IN_PROGRESS = "IN_PROGRESS",
    REVIEW = "REVIEW",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED"
}

export enum EngineeringTeam {
    ARCHITECTURE = "ARCHITECTURE",
    BACKEND = "BACKEND",
    FRONTEND = "FRONTEND",
    DATABASE = "DATABASE",
    API = "API",
    INFRASTRUCTURE = "INFRASTRUCTURE",
    SECURITY = "SECURITY",
    PERFORMANCE = "PERFORMANCE",
    DOCUMENTATION = "DOCUMENTATION",
    TESTING = "TESTING",
    PACKAGING = "PACKAGING",
    RELEASE = "RELEASE"
}

export interface HCAIEngineeringPackage {
    package_id: string;
    blueprint: any;
    architecture_diagrams: string[];
    dependency_graph: any;
    interface_specifications: any[];
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

export interface EngineeringTask {
    task_id: string;
    team: EngineeringTeam;
    objective: string;
    dependencies: string[];
    priority: number;
    estimated_effort: number;
    acceptance_criteria: string[];
    completion_definition: string;
    status: TaskStatus;
}

export interface EngineeringPlan {
    plan_id: string;
    package_id: string;
    work_breakdown_structure: string;
    tasks: EngineeringTask[];
    milestones: string[];
    delivery_roadmap: string[];
    rollback_strategy: string;
    timestamp: number;
}

export interface CodeArtifact {
    artifact_id: string;
    task_id: string;
    language: string;
    content: string;
    path: string;
    timestamp: number;
}

export interface EngineeringDecision {
    decision_id: string;
    context: string;
    decision: string;
    justification: string;
    alternatives_considered: string[];
    timestamp: number;
}

export interface SecurityAssessment {
    assessment_id: string;
    threat_model: string[];
    dependency_analysis: string[];
    secrets_detected: string[];
    vulnerabilities: string[];
    mitigation_plans: string[];
    is_safe: boolean;
    timestamp: number;
}

export interface PerformanceAssessment {
    assessment_id: string;
    cpu_estimate: number;
    memory_estimate: number;
    latency_estimate: number;
    scalability_score: number;
    bottlenecks: string[];
    optimizations_applied: string[];
    timestamp: number;
}

export interface DocumentationPackage {
    doc_id: string;
    developer_docs: string;
    architecture_docs: string;
    api_docs: string;
    deployment_guides: string;
    maintenance_docs: string;
    rollback_procedures: string;
    timestamp: number;
}

export interface BuildArtifact {
    build_id: string;
    artifacts: string[];
    checksums: Record<string, string>;
    sbom: string;
    timestamp: number;
}

export interface ReleaseCandidate {
    rc_id: string;
    plan_id: string;
    engineering_report: string;
    implementation_summary: string;
    known_limitations: string[];
    security_assessment: SecurityAssessment;
    performance_assessment: PerformanceAssessment;
    documentation: DocumentationPackage;
    build_artifact: BuildArtifact;
    verification_package: any;
    timestamp: number;
}

export interface EngineeringGenome {
    genome_id: string;
    engineering_decisions: EngineeringDecision[];
    patterns_used: string[];
    libraries: string[];
    frameworks: string[];
    optimization_decisions: string[];
    security_decisions: string[];
    refactoring_history: string[];
    build_history: string[];
    deployment_history: string[];
    bug_history: string[];
    testing_coverage: number;
    performance_metrics: Record<string, any>;
    timestamp: number;
}

export interface EngineeringDigitalTwinState {
    twin_id: string;
    active_projects: string[];
    task_progress: Record<string, number>;
    build_status: string;
    dependency_graph: any;
    code_quality_metrics: Record<string, number>;
    test_coverage: number;
    security_posture: number;
    technical_debt: number;
    performance_trends: string[];
    release_readiness: number;
    timestamp: number;
}
