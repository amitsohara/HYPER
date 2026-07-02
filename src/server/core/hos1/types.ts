export enum RuntimeState {
    BOOTING = "BOOTING",
    RUNNING = "RUNNING",
    DEGRADED = "DEGRADED",
    SAFE_MODE = "SAFE_MODE",
    SHUTTING_DOWN = "SHUTTING_DOWN",
    OFFLINE = "OFFLINE"
}

export interface RuntimeContext {
    id: string;
    state: RuntimeState;
    startTime: number;
    activeMissions: number;
}

export interface PluginManifest {
    name: string;
    version: string;
    capabilities: string[];
    dependencies: string[];
    permissions: string[];
}

export interface Plugin {
    id: string;
    traceId: string;
    researchId: string;
    manifest: PluginManifest;
    status: "UNLOADED" | "LOADED" | "ACTIVE" | "SUSPENDED" | "ERROR";
    instance?: any;
    timestamp: number;
    version: number;
    confidence: number;
    metadata: any;
    lifecycle: string;
    telemetry: any;
    provenance: string;
}

export interface MissionContext {
    id: string;
    priority: number;
    deadline?: number;
    requiredCapabilities: string[];
    allocatedResources: string[];
}

export interface MissionExecution {
    id: string;
    missionId: string;
    status: "QUEUED" | "RUNNING" | "PAUSED" | "COMPLETED" | "FAILED" | "CANCELLED";
    context: MissionContext;
    startTime: number;
    endTime?: number;
}

export interface MissionCheckpoint {
    id: string;
    executionId: string;
    stateSnapshot: any;
    timestamp: number;
}

export interface ResourceBudget {
    cpuShares: number;
    memoryMb: number;
    gpuShares: number;
    diskMb: number;
    eventThroughputMax: number;
}

export interface ResourceAllocation {
    id: string;
    targetId: string;
    budget: ResourceBudget;
    status: "ALLOCATED" | "REVOKED";
}

export interface HealthStatus {
    id: string;
    subsystem: string;
    isHealthy: boolean;
    metrics: Record<string, number>;
    timestamp: number;
}

export interface AuditRecord {
    id: string;
    action: string;
    actor: string;
    target: string;
    status: "SUCCESS" | "DENIED" | "FAILED";
    timestamp: number;
}
