export enum LearningArtifactType {
    SKILL = "SKILL",
    STRATEGY = "STRATEGY",
    POLICY = "POLICY",
    HEURISTIC = "HEURISTIC",
    PATTERN = "PATTERN",
    CONCEPT = "CONCEPT"
}

export enum ValidationStatus {
    CANDIDATE = "CANDIDATE",
    VALIDATING = "VALIDATING",
    SIMULATION_VERIFIED = "SIMULATION_VERIFIED",
    EXECUTIVE_APPROVED = "EXECUTIVE_APPROVED",
    PROMOTED = "PROMOTED",
    REJECTED = "REJECTED"
}

export interface LearningEvidence {
    id: string;
    sourceEventId: string;
    description: string;
    timestamp: number;
}

export interface Experience {
    id: string;
    traceId: string;
    researchId: string;
    timestamp: number;
    eventType: string;
    payload: any;
    confidence: number;
    provenance: string;
    version: number;
    telemetry: Record<string, any>;
    lifecycle: string;
}

export interface Episode {
    id: string;
    traceId: string;
    researchId: string;
    missionId: string;
    context: any;
    goals: any[];
    observations: any[];
    plans: any[];
    actions: any[];
    results: any[];
    lessons: string[];
    validationStatus: ValidationStatus;
    confidence: number;
    timestamp: number;
    provenance: string;
    version: number;
    telemetry: Record<string, any>;
    lifecycle: string;
}

export interface LearningArtifact {
    id: string;
    traceId: string;
    researchId: string;
    type: LearningArtifactType;
    name: string;
    description: string;
    evidence: LearningEvidence[];
    confidence: number;
    validationStatus: ValidationStatus;
    timestamp: number;
    provenance: string;
    version: number;
    telemetry: Record<string, any>;
    lifecycle: string;
}

export interface LearnedSkill extends LearningArtifact {
    actionSequence: any[];
    preconditions: any;
    expectedOutcomes: any;
}

export interface LearnedStrategy extends LearningArtifact {
    successRate: number;
    executionTime: number;
    resourceCost: number;
    failureModes: string[];
}

export interface LearnedPolicy extends LearningArtifact {
    rules: any[];
    applicability: any;
}

export interface LearnedHeuristic extends LearningArtifact {
    preconditions: any;
    logic: string;
    usageHistory: any[];
}

export interface LearnedPattern extends LearningArtifact {
    patternType: "SUCCESS" | "FAILURE" | "ACTION_SEQUENCE" | "BIAS";
    frequency: number;
}

export interface KnowledgeUpdate {
    id: string;
    traceId: string;
    researchId: string;
    artifactId: string;
    targetSystem: string; // e.g., HWME, HPE
    updatePayload: any;
    timestamp: number;
    confidence: number;
    provenance: string;
    version: number;
    validationStatus: ValidationStatus;
    lifecycle: string;
    telemetry: Record<string, any>;
}

export interface LearningMetric {
    id: string;
    metricName: string;
    value: number;
    timestamp: number;
}
