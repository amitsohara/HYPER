export enum DiagnosticEvents {
    DIAGNOSIS_STARTED = "DiagnosisStarted",
    DIAGNOSIS_COMPLETED = "DiagnosisCompleted",
    ROOT_CAUSE_DISCOVERED = "RootCauseDiscovered",
    SUCCESS_PATTERN_DETECTED = "SuccessPatternDetected",
    FAILURE_PATTERN_DETECTED = "FailurePatternDetected",
    SYSTEMIC_ISSUE_DETECTED = "SystemicIssueDetected",
    COUNTERFACTUAL_GENERATED = "CounterfactualGenerated",
    RECOMMENDATION_CREATED = "RecommendationCreated",
    DIAGNOSTIC_ARCHIVED = "DiagnosticArchived",
    AUTOPSY_GENERATED = "AutopsyGenerated"
}

export type EventCallback = (payload: any) => void;

export class DiagnosticEventBus {
    private static instance: DiagnosticEventBus;
    private listeners: Map<DiagnosticEvents, EventCallback[]> = new Map();

    private constructor() {}

    public static getInstance(): DiagnosticEventBus {
        if (!DiagnosticEventBus.instance) {
            DiagnosticEventBus.instance = new DiagnosticEventBus();
        }
        return DiagnosticEventBus.instance;
    }

    public subscribe(event: DiagnosticEvents, callback: EventCallback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event)?.push(callback);
    }

    public publish(event: DiagnosticEvents, payload: any) {
        const callbacks = this.listeners.get(event) || [];
        callbacks.forEach(cb => cb(payload));
    }
}
