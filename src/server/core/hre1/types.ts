export enum InferenceNodeType {
    OBSERVATION = "OBSERVATION",
    CONCEPT = "CONCEPT",
    THOUGHT = "THOUGHT",
    HYPOTHESIS = "HYPOTHESIS",
    CONCLUSION = "CONCLUSION"
}

export enum InferenceEdgeType {
    SUPPORTS = "SUPPORTS",
    CONTRADICTS = "CONTRADICTS",
    DEPENDS_ON = "DEPENDS_ON",
    DERIVED_FROM = "DERIVED_FROM",
    CAUSES = "CAUSES",
    REQUIRES = "REQUIRES"
}

export interface InferenceNode {
    id: string;
    type: InferenceNodeType;
    content: string;
    confidence: number;
    metadata: Record<string, any>;
}

export interface InferenceEdge {
    sourceId: string;
    targetId: string;
    type: InferenceEdgeType;
    weight: number;
}

export interface InferenceGraph {
    nodes: Map<string, InferenceNode>;
    edges: InferenceEdge[];
}

export interface Evidence {
    id: string;
    source: string;
    content: string;
    confidence: number;
    provenance: string;
}

export interface Explanation {
    humanReadable: string;
    reasoningTrace: string[];
    evidenceReferences: string[];
    confidenceJustification: string;
    alternativeHypotheses: string[];
}

export interface ReasoningConclusion {
    id: string;
    content: string;
    confidence: number;
    explanation: Explanation;
    isFinal: boolean;
}

export interface ReasoningSession {
    id: string;
    goal: string;
    inputs: string[];
    selectedStrategy: string;
    evidenceSet: Evidence[];
    hypotheses: string[];
    inferenceGraph: InferenceGraph;
    intermediateConclusions: ReasoningConclusion[];
    finalConclusions: ReasoningConclusion[];
    alternativeConclusions: ReasoningConclusion[];
    overallConfidence: number;
    executionMetrics: Record<string, number>;
    researchTraceability: {
        hirqIds: string[];
        tgpId: string;
        mrpId: string;
    };
    version: number;
    metadata: Record<string, any>;
    createdAt: number;
    updatedAt: number;
}
