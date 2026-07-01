export enum CognitiveDomain {
    OBSERVATION = "OBSERVATION",
    MEMORY = "MEMORY",
    KNOWLEDGE = "KNOWLEDGE",
    REASONING = "REASONING",
    PLANNING = "PLANNING",
    LEARNING = "LEARNING",
    DECISION = "DECISION",
    EXECUTION = "EXECUTION",
    VERIFICATION = "VERIFICATION",
    EVOLUTION = "EVOLUTION",
    MONITORING = "MONITORING",
    SECURITY = "SECURITY",
    SYSTEM = "SYSTEM"
}

export enum EventPriority {
    LOW = 0,
    NORMAL = 1,
    HIGH = 2,
    CRITICAL = 3
}

export interface SecurityMetadata {
    authorizedRoles?: string[];
    signature?: string;
    encryptionStatus?: "NONE" | "ENCRYPTED";
}

export interface CognitiveEvent<T = any> {
    id: string;
    type: string;
    domain: CognitiveDomain;
    priority: EventPriority;
    timestamp: number;
    source: string;
    destination?: string;
    correlationId?: string;
    sessionId?: string;
    traceId?: string;
    relatedHirqIds?: string[];
    relatedHctIds?: string[];
    confidence?: number;
    payload: T;
    metadata?: Record<string, any>;
    securityMetadata?: SecurityMetadata;
}

export interface EventTrace {
    eventId: string;
    traceId: string;
    correlationId?: string;
    parentEventId?: string;
    timestamp: number;
    lifecycleHistory: EventLifecycleEntry[];
}

export enum EventLifecycleStatus {
    CREATED = "CREATED",
    VALIDATED = "VALIDATED",
    REGISTERED = "REGISTERED",
    QUEUED = "QUEUED",
    DISPATCHED = "DISPATCHED",
    RECEIVED = "RECEIVED",
    PROCESSED = "PROCESSED",
    OBSERVED = "OBSERVED",
    PERSISTED = "PERSISTED",
    ARCHIVED = "ARCHIVED",
    FAILED = "FAILED"
}

export interface EventLifecycleEntry {
    status: EventLifecycleStatus;
    timestamp: number;
    details?: string;
}

export interface EventMetrics {
    throughput: number;
    latency: number;
    retries: number;
    failures: number;
    queueDepth: number;
    subscribers: number;
    publishRate: number;
    memoryUsage: number;
}
