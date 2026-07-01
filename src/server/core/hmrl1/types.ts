export enum ReasoningStrategy {
    DEDUCTIVE = "DEDUCTIVE",
    INDUCTIVE = "INDUCTIVE",
    ABDUCTIVE = "ABDUCTIVE",
    ANALOGICAL = "ANALOGICAL",
    SIMULATION = "SIMULATION",
    CONSTRAINT_BASED = "CONSTRAINT_BASED",
    PROBABILISTIC = "PROBABILISTIC",
    CASE_BASED = "CASE_BASED",
    HYBRID = "HYBRID"
}

export enum CognitiveBiasType {
    CONFIRMATION = "CONFIRMATION",
    ANCHORING = "ANCHORING",
    AVAILABILITY = "AVAILABILITY",
    PREMATURE_CLOSURE = "PREMATURE_CLOSURE",
    OVER_GENERALIZATION = "OVER_GENERALIZATION",
    CONTRADICTION_BLINDNESS = "CONTRADICTION_BLINDNESS",
    INCOMPLETE_EVIDENCE = "INCOMPLETE_EVIDENCE",
    CIRCULAR_REASONING = "CIRCULAR_REASONING",
    UNSUPPORTED_ASSUMPTIONS = "UNSUPPORTED_ASSUMPTIONS"
}

export interface BiasReport {
    type: CognitiveBiasType;
    severity: number; // 0.0 to 1.0
    description: string;
    affectedThoughtIds: string[];
}

export interface ReasoningReflection {
    goalAchieved: boolean;
    confidenceAcceptable: boolean;
    additionalEvidenceRequired: boolean;
    suggestedStrategyChange?: ReasoningStrategy;
    reviseHypotheses: boolean;
    recommendations: string[];
    timestamp: number;
}

export interface CognitiveCost {
    cpuEstimate: number;
    memoryEstimate: number;
    latencyEstimate: number;
    attentionCost: number;
    expectedValue: number;
    specialistUtilization: number;
}

export interface MetaReasoningSession {
    id: string;
    reasoningSessionId: string;
    selectedStrategy: ReasoningStrategy;
    alternativeStrategies: ReasoningStrategy[];
    evidenceSummary: string;
    confidence: number;
    biasReports: BiasReport[];
    reflections: ReasoningReflection[];
    activeHypothesisIds: string[];
    contradictionIds: string[];
    recommendations: string[];
    revisionHistory: number;
    performanceMetrics: Record<string, number>;
    researchTraceability: {
        hirqIds: string[];
        mrpId: string;
        hctIds: string[];
    };
    version: number;
    metadata: Record<string, any>;
    createdAt: number;
    updatedAt: number;
}
