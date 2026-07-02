export enum MissionState {
    CREATED = "CREATED",
    ACCEPTED = "ACCEPTED",
    PLANNING = "PLANNING",
    EXECUTING = "EXECUTING",
    MONITORING = "MONITORING",
    PAUSED = "PAUSED",
    COMPLETED = "COMPLETED",
    ARCHIVED = "ARCHIVED",
    CANCELLED = "CANCELLED"
}

export enum DecisionStatus {
    PENDING = "PENDING",
    EVALUATING = "EVALUATING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED"
}

export interface DecisionConfidence {
    score: number;
    sources: { sourceId: string; confidence: number }[];
}

export interface DecisionPolicy {
    id: string;
    type: "SAFETY" | "RESOURCE" | "ETHICS" | "USER_PREFERENCE";
    name: string;
    description: string;
    evaluate: (context: DecisionContext, option: DecisionOption) => boolean;
}

export interface DecisionConstraint {
    id: string;
    description: string;
    isHard: boolean; // if true, failure rejects the option
}

export interface DecisionEvidence {
    sourceId: string;
    type: string;
    data: any;
}

export interface DecisionOption {
    id: string;
    planId: string;
    predictedOutcomes: any[];
    utilityScore?: number;
    riskScore?: number;
    confidence: DecisionConfidence;
    policyPassed?: boolean;
}

export interface DecisionContext {
    missionId: string;
    worldStateSnapshot: any;
    goalId?: string;
}

export interface Decision {
    id: string;
    context: DecisionContext;
    options: DecisionOption[];
    selectedOptionId?: string;
    status: DecisionStatus;
    authorizationReason?: string;
    traceId: string;
    timestamp: number;
}

export interface Mission {
    id: string;
    name: string;
    description: string;
    state: MissionState;
    goalIds: string[];
    createdAt: number;
    updatedAt: number;
    traceId: string;
}

export interface ExecutiveCommand {
    id: string;
    missionId: string;
    actionType: "PAUSE" | "RESUME" | "CANCEL" | "OVERRIDE";
    reason: string;
    timestamp: number;
}
