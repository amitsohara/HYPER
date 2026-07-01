export enum ConceptLifecycleState {
    DISCOVERED = "DISCOVERED",
    VALIDATING = "VALIDATING",
    ACTIVE = "ACTIVE",
    MERGED = "MERGED",
    SPLIT = "SPLIT",
    DEPRECATED = "DEPRECATED",
    ARCHIVED = "ARCHIVED"
}

export interface ConceptRelationship {
    targetId: string;
    type: "is-a" | "part-of" | "depends-on" | "causes" | "used-for" | "created-by" | "derived-from" | "similar-to" | "opposite-of" | "supports" | "conflicts-with";
    weight: number;
    evidence: string[];
}

export interface ConceptConfidenceMetrics {
    confidence: number;
    evidenceCount: number;
    observationCount: number;
    usageFrequency: number;
    verificationScore: number;
    historicalStability: number;
}

export interface CanonicalConcept {
    id: string;
    name: string;
    description: string;
    parentConcepts: string[];
    childConcepts: string[];
    relatedConcepts: ConceptRelationship[];
    origin: string;
    evidence: string[];
    metrics: ConceptConfidenceMetrics;
    worldModelReferences: string[];
    temporalHistory: any[];
    researchTraceability: {
        hirqIds: string[];
        wcpId: string;
        cepId: string;
        hctIds: string[];
    };
    version: number;
    lifecycleState: ConceptLifecycleState;
    metadata: Record<string, any>;
}
