export enum EngineeringEvents {
    ENGINEERING_PLAN_CREATED = "EngineeringPlanCreated",
    TASK_GENERATED = "TaskGenerated",
    IMPLEMENTATION_COMPLETED = "ImplementationCompleted",
    REFACTORING_COMPLETED = "RefactoringCompleted",
    SECURITY_REVIEW_COMPLETED = "SecurityReviewCompleted",
    PERFORMANCE_ANALYSIS_COMPLETED = "PerformanceAnalysisCompleted",
    DOCUMENTATION_GENERATED = "DocumentationGenerated",
    BUILD_COMPLETED = "BuildCompleted",
    RELEASE_CANDIDATE_GENERATED = "ReleaseCandidateGenerated",
    ENGINEERING_GENOME_UPDATED = "EngineeringGenomeUpdated",
    ENGINEERING_TWIN_UPDATED = "EngineeringTwinUpdated"
}

export type EventCallback = (payload: any) => void;

export class EngineeringEventBus {
    private static instance: EngineeringEventBus;
    private listeners: Map<EngineeringEvents, EventCallback[]> = new Map();

    private constructor() {}

    public static getInstance(): EngineeringEventBus {
        if (!EngineeringEventBus.instance) {
            EngineeringEventBus.instance = new EngineeringEventBus();
        }
        return EngineeringEventBus.instance;
    }

    public subscribe(event: EngineeringEvents, callback: EventCallback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event)?.push(callback);
    }

    public publish(event: EngineeringEvents, payload: any) {
        const callbacks = this.listeners.get(event) || [];
        callbacks.forEach(cb => cb(payload));
    }
}
