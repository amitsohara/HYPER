import { CognitiveDomain, CognitiveEvent } from "../hcns01/types.js";

export enum CognitiveRole {
    OBSERVER = "OBSERVER",
    MEMORY = "MEMORY",
    KNOWLEDGE = "KNOWLEDGE",
    REASONING = "REASONING",
    PLANNING = "PLANNING",
    LEARNING = "LEARNING",
    VERIFICATION = "VERIFICATION",
    EXECUTION = "EXECUTION",
    CREATIVITY = "CREATIVITY",
    COMMUNICATION = "COMMUNICATION",
    SECURITY = "SECURITY",
    MONITORING = "MONITORING"
}

export enum SpecialistStatus {
    LOADING = "LOADING",
    INITIALIZING = "INITIALIZING",
    ACTIVE = "ACTIVE",
    SUSPENDED = "SUSPENDED",
    RETIRING = "RETIRING",
    ERROR = "ERROR",
    RECOVERING = "RECOVERING"
}

export interface SpecialistCapability {
    name: string;
    description: string;
    domain: CognitiveDomain;
    roles: CognitiveRole[];
    requiredInputs: string[];
    producedOutputs: string[];
    confidence: number;
}

export interface SpecialistRegistration {
    id: string;
    name: string;
    version: string;
    capabilities: SpecialistCapability[];
    status: SpecialistStatus;
    availability: number; // 0.0 to 1.0
    priority: number;
    dependencies: string[];
    resourceRequirements: Record<string, any>;
    communicationEndpoints: string[];
    researchMapping: {
        hirqIds: string[];
        hctIds: string[];
    };
}

export enum SocietyState {
    IDLE = "IDLE",
    OBSERVING = "OBSERVING",
    REASONING = "REASONING",
    PLANNING = "PLANNING",
    LEARNING = "LEARNING",
    VERIFYING = "VERIFYING",
    EXECUTING = "EXECUTING",
    RECOVERING = "RECOVERING",
    INITIALIZING = "INITIALIZING",
    SHUTTING_DOWN = "SHUTTING_DOWN"
}

export interface CognitiveSession {
    sessionId: string;
    goals: string[];
    participants: string[]; // Specialist IDs
    state: SocietyState;
    timeline: { timestamp: number; eventId: string; description: string }[];
    decisionHistory: string[];
    finalOutcome?: string;
    replayReference?: string;
}

export interface SocietyHealthMetrics {
    activeSpecialists: number;
    failures: number;
    responseTimesAvg: number;
    communicationQuality: number;
    taskCompletionRate: number;
    collaborationMetrics: Record<string, number>;
    overallScore: number;
}

export interface ISpecialist {
    getIdentity(): SpecialistRegistration;
    initialize(): Promise<void>;
    activate(): Promise<void>;
    suspend(): Promise<void>;
    resume(): Promise<void>;
    retire(): Promise<void>;
    recover(): Promise<void>;
    handleEvent(event: CognitiveEvent): Promise<void>;
    getHealth(): { status: SpecialistStatus; metrics: Record<string, any> };
    getConfidence(taskDescription: string): number;
}
