export enum ObservabilityEvents {
    TELEMETRY_COLLECTED = "TelemetryCollected",
    HEALTH_UPDATED = "HealthUpdated",
    BOTTLENECK_DETECTED = "BottleneckDetected",
    TREND_DETECTED = "TrendDetected",
    REGRESSION_DETECTED = "RegressionDetected",
    CAPABILITY_IMPROVED = "CapabilityImproved",
    EVOLUTION_READINESS_UPDATED = "EvolutionReadinessUpdated",
    DIGITAL_TWIN_UPDATED = "DigitalTwinUpdated",
    DASHBOARD_GENERATED = "DashboardGenerated",
    PREDICTION_GENERATED = "PredictionGenerated"
}

export type EventCallback = (payload: any) => void;

export class ObservabilityEventBus {
    private static instance: ObservabilityEventBus;
    private listeners: Map<ObservabilityEvents, EventCallback[]> = new Map();

    private constructor() {}

    public static getInstance(): ObservabilityEventBus {
        if (!ObservabilityEventBus.instance) {
            ObservabilityEventBus.instance = new ObservabilityEventBus();
        }
        return ObservabilityEventBus.instance;
    }

    public subscribe(event: ObservabilityEvents, callback: EventCallback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event)?.push(callback);
    }

    public publish(event: ObservabilityEvents, payload: any) {
        const callbacks = this.listeners.get(event) || [];
        callbacks.forEach(cb => cb(payload));
    }
}
