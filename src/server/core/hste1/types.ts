export enum SimulationType {
    DISCRETE_EVENT = "DISCRETE_EVENT",
    CONTINUOUS = "CONTINUOUS",
    AGENT_BASED = "AGENT_BASED",
    MONTE_CARLO = "MONTE_CARLO",
    COUNTERFACTUAL = "COUNTERFACTUAL"
}

export enum ScenarioCategory {
    BEST_CASE = "BEST_CASE",
    WORST_CASE = "WORST_CASE",
    AVERAGE_CASE = "AVERAGE_CASE",
    ADVERSARIAL = "ADVERSARIAL",
    RANDOMIZED = "RANDOMIZED",
    USER_DEFINED = "USER_DEFINED",
    COUNTERFACTUAL = "COUNTERFACTUAL"
}

export interface WorldTwin {
    id: string;
    parentWorldId: string;
    version: number;
    timestamp: number;
    state: Record<string, any>; // Snapshot of HWME entities and relations
    metadata: Record<string, any>;
}

export interface SimulationScenario {
    id: string;
    name: string;
    category: ScenarioCategory;
    initialState: WorldTwin;
    interventions: Record<string, any>; // Counterfactual changes
    parameters: Record<string, any>;
    durationMs: number;
    stepSizeMs: number;
}

export interface SimulationMetric {
    utility: number;
    risk: number;
    cost: number;
    confidence: number;
    successProbability: number;
}

export interface OutcomePrediction {
    id: string;
    scenarioId: string;
    finalState: WorldTwin;
    metrics: SimulationMetric;
    narrative: string;
}

export interface SimulationStep {
    timestamp: number;
    action?: string;
    stateChanges: any;
}

export interface SimulationTrace {
    id: string;
    simulationId: string;
    steps: SimulationStep[];
    metadata: Record<string, any>;
}

export interface SimulationRun {
    id: string;
    scenarioId: string;
    status: "PENDING" | "RUNNING" | "COMPLETED" | "FAILED";
    startTime: number;
    endTime?: number;
    outcome?: OutcomePrediction;
    trace?: SimulationTrace;
}
