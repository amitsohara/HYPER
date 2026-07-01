export enum ThoughtLifecycleState {
    GENERATED = "GENERATED",
    ACTIVE = "ACTIVE",
    SUSPENDED = "SUSPENDED",
    REFINED = "REFINED",
    MERGED = "MERGED",
    SPLIT = "SPLIT",
    REJECTED = "REJECTED",
    ARCHIVED = "ARCHIVED",
    RETIRED = "RETIRED"
}

export enum ThoughtDependencyType {
    SUPPORTS = "SUPPORTS",
    CONTRADICTS = "CONTRADICTS",
    DEPENDS_ON = "DEPENDS_ON",
    EXTENDS = "EXTENDS",
    QUESTIONS = "QUESTIONS",
    REFINES = "REFINES",
    SUPERSEDES = "SUPERSEDES"
}

export interface ThoughtDependency {
    targetId: string;
    type: ThoughtDependencyType;
    evidence: string[];
}

export interface ThoughtObject {
    id: string;
    sessionId: string;
    origin: string;
    currentStatus: string;
    summary: string;
    detailedRepresentation: string;
    associatedWorldObjects: string[];
    associatedConcepts: string[];
    associatedGoals: string[];
    associatedSpecialists: string[];
    attentionScore: number;
    confidence: number;
    evidence: string[];
    dependencies: ThoughtDependency[];
    contradictions: string[]; // IDs of contradicting thoughts
    predictions: string[];
    priority: number;
    lifecycleState: ThoughtLifecycleState;
    version: number;
    researchTraceability: {
        hirqIds: string[];
        tgpId: string;
        hctIds: string[];
    };
    metadata: Record<string, any>;
    createdAt: number;
    updatedAt: number;
}
