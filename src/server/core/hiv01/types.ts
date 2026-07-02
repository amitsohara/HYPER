export enum CertificationLevel {
    NONE = "NONE",
    BRONZE = "BRONZE",     // Subsystem Stable
    SILVER = "SILVER",     // Mission Stable
    GOLD = "GOLD",         // Stress Stable
    PLATINUM = "PLATINUM"  // Production Certified
}

export interface MissionScenario {
    id: string;
    name: string;
    domain: string;
    description: string;
    initialWorldState: any;
    goals: string[];
    expectedTrace: string[];
    allowedLatencyMs: number;
}

export interface ValidationReport {
    missionId: string;
    scenarioId: string;
    success: boolean;
    durationMs: number;
    subsystemHealth: Record<string, boolean>;
    traceValid: boolean;
    explainabilityValid: boolean;
    learningValid: boolean;
    errors: string[];
    metrics: Record<string, any>;
}

export interface FaultInjectionPlan {
    id: string;
    scenarioId: string;
    faults: {
        type: "DROP_EVENT" | "CORRUPT_MESSAGE" | "DELAY_RESPONSE" | "NOISE_SENSOR" | "FAIL_PLAN";
        targetSubsystem: string;
        targetEventType?: string;
        triggerTimeOffsetMs: number;
    }[];
}

export interface StressTestConfig {
    concurrentMissions: number;
    durationMs: number;
    scenarioIds: string[];
}

export interface CertificationResult {
    version: string;
    timestamp: number;
    level: CertificationLevel;
    missionSuccessRate: number;
    meanLatencyMs: number;
    faultRecoveryRate: number;
    scorecard: Record<string, any>;
}
