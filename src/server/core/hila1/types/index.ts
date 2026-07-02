export enum IntelligenceMode {
    AUTONOMOUS = "AUTONOMOUS",
    ASSISTED = "ASSISTED",
    EXPLORATORY = "EXPLORATORY",
    SAFE_MODE = "SAFE_MODE",
    OFFLINE = "OFFLINE",
    RESEARCH = "RESEARCH",
    EMERGENCY = "EMERGENCY",
    MISSION_CRITICAL = "MISSION_CRITICAL"
}

export enum ProviderType {
    GEMINI = "GEMINI",
    GPT = "GPT",
    CLAUDE = "CLAUDE",
    LOCAL_LLAMA = "LOCAL_LLAMA",
    LOCAL_QWEN = "LOCAL_QWEN",
    MOCK = "MOCK"
}

export interface IntelligenceRequest {
    id: string;
    missionId: string;
    domain: string;
    task: string;
    context: any;
    priority: number;
    requiredConfidence: number;
    latencyBudgetMs?: number;
    costBudget?: number;
}

export interface IntelligenceResponse {
    id: string;
    requestId: string;
    provider: ProviderType | "INTERNAL";
    content: any;
    confidence: number;
    latencyMs: number;
    costEstimate: number;
    wasValidated: boolean;
    validationDetails: any;
    fallbackTriggered: boolean;
}

export interface ArbitrationDecision {
    useExternal: boolean;
    reason: string;
    confidence: number;
    selectedProvider?: ProviderType;
    estimatedCost?: number;
    estimatedLatency?: number;
}

export interface ArbitrationMetrics {
    totalRequests: number;
    internalSuccesses: number;
    externalInvocations: number;
    averageConfidence: number;
    hallucinationCount: number;
    totalCost: number;
    averageLatency: number;
    knowledgeGapResolutions: number;
}
