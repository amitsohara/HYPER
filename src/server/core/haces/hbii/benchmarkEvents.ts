export enum BenchmarkEvents {
    BENCHMARK_STARTED = "HBII_BENCHMARK_STARTED",
    BENCHMARK_COMPLETED = "HBII_BENCHMARK_COMPLETED",
    REGRESSION_DETECTED = "HBII_REGRESSION_DETECTED",
    IMPROVEMENT_DETECTED = "HBII_IMPROVEMENT_DETECTED",
    PASSPORT_GENERATED = "HBII_PASSPORT_GENERATED",
    BENCHMARK_RETIRED = "HBII_BENCHMARK_RETIRED",
    BENCHMARK_CREATED = "HBII_BENCHMARK_CREATED",
    GENERALIZATION_VERIFIED = "HBII_GENERALIZATION_VERIFIED",
    TREND_UPDATED = "HBII_TREND_UPDATED",
    EXECUTIVE_REPORT_GENERATED = "HBII_EXECUTIVE_REPORT_GENERATED"
}

export class BenchmarkEventBus {
    private static instance: BenchmarkEventBus;
    private listeners: Record<string, ((data: any) => void)[]> = {};

    private constructor() {}

    public static getInstance(): BenchmarkEventBus {
        if (!BenchmarkEventBus.instance) {
            BenchmarkEventBus.instance = new BenchmarkEventBus();
        }
        return BenchmarkEventBus.instance;
    }

    public subscribe(event: BenchmarkEvents, callback: (data: any) => void) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }

    public publish(event: BenchmarkEvents, data: any) {
        console.log(`[HBII Event] ${event}`, data);
        if (this.listeners[event]) {
            this.listeners[event].forEach(cb => cb(data));
        }
    }
}
