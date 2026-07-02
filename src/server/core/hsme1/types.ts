export enum ValidationStatus {
    CANDIDATE = "CANDIDATE",
    VALIDATING = "VALIDATING",
    SIMULATION_VERIFIED = "SIMULATION_VERIFIED",
    EXECUTIVE_APPROVED = "EXECUTIVE_APPROVED",
    PROMOTED = "PROMOTED",
    REJECTED = "REJECTED"
}

export interface MotorFeedback {
    id: string;
    traceId: string;
    success: boolean;
    latency: number;
    precision: number;
    stability: number;
    energy: number;
    smoothness: number;
    safety: number;
    errorDelta?: any; // Difference between expected and observed
    timestamp: number;
}

export interface MotorPrimitive {
    id: string;
    name: string; // e.g. "Move Forward", "Grip"
    description: string;
    parameters: any;
    version: number;
}

export interface MotorSequence {
    id: string;
    steps: { primitiveId: string; parameters: any }[];
}

export interface Trajectory {
    id: string;
    waypoints: any[];
    constraints: any[];
    duration: number;
    smoothness: number;
}

export interface MotorPolicy {
    id: string;
    parameters: any; // Weights, gains (e.g. PID), etc.
    optimizationAlgorithm: string;
    performanceHistory: MotorFeedback[];
}

export interface MotorProgram {
    id: string;
    sequence: MotorSequence;
    trajectory?: Trajectory;
    policy: MotorPolicy;
}

export interface MotorSkill {
    id: string;
    traceId: string;
    researchId: string;
    name: string;
    description: string;
    program: MotorProgram;
    preconditions: any;
    confidence: number;
    validationStatus: ValidationStatus;
    supportedEnvironments: string[];
    provenance: string;
    version: number;
    lifecycle: string;
    timestamp: number;
    telemetry: Record<string, any>;
}

export interface ProceduralMemory {
    id: string;
    skills: Record<string, MotorSkill>;
    lastUpdated: number;
}

export interface RewardSignal {
    id: string;
    traceId: string;
    source: string;
    value: number;
    timestamp: number;
}

export interface MotorExperience {
    id: string;
    traceId: string;
    skillId: string;
    context: any;
    feedback: MotorFeedback;
    timestamp: number;
}
