export enum TaskStatus {
    PENDING = "PENDING",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    CANCELLED = "CANCELLED"
}

export enum PlanStatus {
    DRAFT = "DRAFT",
    EVALUATING = "EVALUATING",
    READY = "READY",
    EXECUTING = "EXECUTING",
    REPAIRING = "REPAIRING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    CANCELLED = "CANCELLED"
}

export interface ResourceEstimate {
    specialistsRequired: string[];
    memoryUsage: number;
    computationBudget: number;
    executionTimeMs: number;
    parallelismOpportunities: number;
}

export interface RiskAssessment {
    failureProbability: number;
    missingResources: string[];
    dependencyRisks: string[];
    uncertaintyScore: number;
    cascadingFailuresScore: number;
}

export interface PlanEvaluation {
    expectedUtility: number;
    riskScore: number;
    confidenceScore: number;
    complexityScore: number;
    efficiencyScore: number;
    noveltyScore: number;
    constraintSatisfaction: number;
    overallScore: number;
    explainability: string;
}

export interface AtomicTask {
    id: string;
    name: string;
    description: string;
    status: TaskStatus;
    dependencies: string[];
    preconditions: string[];
    postconditions: string[];
    requiredSpecialists: string[];
    estimatedDurationMs: number;
    metrics: Record<string, any>;
}

export interface PlanTraceStep {
    timestamp: number;
    action: string;
    details: string;
}

export interface PlanObject {
    id: string;
    goalId: string;
    parentGoalId?: string;
    version: number;
    status: PlanStatus;
    candidateRank?: number;
    priority: number;
    atomicTasks: Map<string, AtomicTask>;
    resourceEstimate: ResourceEstimate;
    riskAssessment: RiskAssessment;
    evaluation?: PlanEvaluation;
    confidence: number;
    explainability: string;
    planningTrace: PlanTraceStep[];
    executionMetrics: Record<string, any>;
    researchTraceability: {
        hirqIds: string[];
        tgpId: string;
        mrpId: string;
    };
    metadata: Record<string, any>;
    createdAt: number;
    updatedAt: number;
}

export interface GoalObject {
    id: string;
    name: string;
    description: string;
    subGoalIds: string[];
    priority: number;
    status: TaskStatus;
}
