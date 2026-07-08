export interface MissionResult {
    missionId: string;
    directive: string;
    status: "SUCCESS" | "PARTIAL_SUCCESS" | "FAILED" | "ABORTED" | "CANCELLED";
    confidence: number;
    score: number;
    durationMs: number;
    objective: string;
    outcome: string;
    rootCauses: string[];
    unexpectedFindings: string[];
    recommendations: RecommendedAction[];
    evidence: EvidenceItem[];
    simulationComparison: SimulationScenario[];
    cognitiveReasoningSummary: string;
    confidenceBreakdown: ConfidenceBreakdown;
    timeline: MissionTimelineEvent[];
    timestamp: number;
}

export interface RecommendedAction {
    id: string;
    priority: number;
    description: string;
    expectedImprovement: string;
    estimatedCost: string;
    implementationDifficulty: "Low" | "Medium" | "High";
}

export interface EvidenceItem {
    source: string;
    description: string;
    confidence: number;
}

export interface SimulationScenario {
    name: string;
    metrics: string;
    selected: boolean;
}

export interface ConfidenceBreakdown {
    perception: number;
    worldModel: number;
    reasoning: number;
    planning: number;
    simulation: number;
    decision: number;
    execution: number;
    learning: number;
    overall: number;
}

export interface MissionTimelineEvent {
    id: string;
    event: string;
    timestamp: number;
}
