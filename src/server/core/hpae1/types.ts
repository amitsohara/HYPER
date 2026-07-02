export enum SensorType {
    VISION = "VISION",
    AUDIO = "AUDIO",
    API = "API",
    DESKTOP = "DESKTOP",
    ROBOT = "ROBOT"
}

export enum ActionStatus {
    PENDING = "PENDING",
    EXECUTING = "EXECUTING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    CANCELLED = "CANCELLED"
}

export interface Observation {
    id: string;
    source: SensorType;
    timestamp: number;
    data: any;
    confidence: number;
    metadata: Record<string, any>;
}

export interface UnifiedObservation {
    id: string;
    timestamp: number;
    entities: any[];
    events: any[];
    relationships: any[];
    confidence: number;
    sourceObservations: string[];
}

export interface MotorCommand {
    id: string;
    actionId: string;
    type: string; // "CLICK", "TYPE", "MOVE", "API_CALL"
    payload: any;
}

export interface ExecutionFeedback {
    actionId: string;
    success: boolean;
    latencyMs: number;
    reward?: number;
    penalty?: number;
    error?: string;
    resultingObservation?: Observation;
}

export interface Skill {
    id: string;
    name: string;
    description: string;
    parameters: string[];
    preconditions: string[];
    postconditions: string[];
    confidence: number;
    executionCost: number;
    version: number;
}

export interface Action {
    id: string;
    planId: string;
    skillId: string;
    parameters: Record<string, any>;
    status: ActionStatus;
    timestamp: number;
}

export interface ExecutionTrace {
    id: string;
    actionId: string;
    motorCommands: MotorCommand[];
    feedback: ExecutionFeedback;
    timestamp: number;
}
