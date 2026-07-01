export enum AttentionFocusMode {
    FOCUSED = "FOCUSED",
    DIVIDED = "DIVIDED",
    SUSTAINED = "SUSTAINED",
    EXPLORATORY = "EXPLORATORY",
    RECOVERY = "RECOVERY"
}

export interface AttentionScore {
    totalScore: number;
    components: {
        relevance: number;
        novelty: number;
        urgency: number;
        importance: number;
        uncertainty: number;
        expectedUtility: number;
        confidence: number;
    };
}

export interface AttentionCandidate {
    id: string;
    type: "GOAL" | "WORLD_REGION" | "CONCEPT" | "EVENT";
    referenceId: string;
    score: AttentionScore;
    timestamp: number;
}

export interface SaliencyMetrics {
    novelty: number;
    unexpectedness: number;
    importance: number;
    urgency: number;
    risk: number;
    reward: number;
    predictionError: number;
    contradiction: number;
}

export interface WorkingMemoryState {
    activeGoals: string[];
    activeWorldRegions: string[];
    activeConcepts: string[];
    capacity: number;
    currentLoad: number;
}

export interface AttentionRecord {
    id: string;
    timestamp: number;
    mode: AttentionFocusMode;
    candidatesSelected: string[];
    reasoning: string;
}

export interface CognitiveLoadMetrics {
    cpuBudget: number;
    memoryBudget: number;
    activeSpecialists: number;
    pendingTasks: number;
    queueDepth: number;
    latency: number;
}
