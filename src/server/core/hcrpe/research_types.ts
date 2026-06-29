export enum ResearchStatus {
    PROPOSED = "PROPOSED",
    PLANNED = "PLANNED",
    ACTIVE = "ACTIVE",
    COMPLETED = "COMPLETED",
    REJECTED = "REJECTED"
}

export enum QuestionType {
    EXPLORATORY = "EXPLORATORY",
    DIAGNOSTIC = "DIAGNOSTIC",
    COMPARATIVE = "COMPARATIVE",
    CAUSAL = "CAUSAL",
    PREDICTIVE = "PREDICTIVE"
}

export enum GapType {
    MISSING_MECHANISM = "MISSING_MECHANISM",
    MISSING_PRINCIPLE = "MISSING_PRINCIPLE",
    UNKNOWN_ENTITY = "UNKNOWN_ENTITY",
    UNKNOWN_RELATIONSHIP = "UNKNOWN_RELATIONSHIP",
    MISSING_DATA = "MISSING_DATA",
    UNVALIDATED_HYPOTHESIS = "UNVALIDATED_HYPOTHESIS",
    WEAK_CONFIDENCE = "WEAK_CONFIDENCE",
    INCOMPLETE_MODEL = "INCOMPLETE_MODEL"
}

export enum ContradictionType {
    CONFLICTING_EVIDENCE = "CONFLICTING_EVIDENCE",
    CONFLICTING_MECHANISMS = "CONFLICTING_MECHANISMS",
    CONFLICTING_PRINCIPLES = "CONFLICTING_PRINCIPLES",
    CONTRADICTORY_PREDICTIONS = "CONTRADICTORY_PREDICTIONS",
    DOMAIN_INCONSISTENCY = "DOMAIN_INCONSISTENCY",
    LOGICAL_INCONSISTENCY = "LOGICAL_INCONSISTENCY"
}

export interface ResearchMetricsData {
    potential_impact: number;
    knowledge_gain: number;
    uncertainty_reduction: number;
    scientific_novelty: number;
    cross_domain_usefulness: number;
    mission_relevance: number;
    cost: number;
    time: number;
    risk: number;
}
