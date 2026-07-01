import { HyperMindEventMesh, CognitiveDomain, EventPriority } from "../../hcns01/index.js";

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

// Register these schemas so the Mesh allows them
const mesh = HyperMindEventMesh.getInstance();
Object.values(BenchmarkEvents).forEach(type => {
    if (!mesh.registry.isRegistered(type)) {
        mesh.registerEventType({
            type,
            domain: CognitiveDomain.VERIFICATION, // Assume VERIFICATION
            description: `Benchmark Event: ${type}`
        });
    }
});

/**
 * Backward compatible facade pointing to HyperMindEventMesh (HCNS-01)
 */
export class BenchmarkEventBus {
    private static instance: BenchmarkEventBus;
    private mesh = HyperMindEventMesh.getInstance();

    private constructor() {}

    public static getInstance(): BenchmarkEventBus {
        if (!BenchmarkEventBus.instance) {
            BenchmarkEventBus.instance = new BenchmarkEventBus();
        }
        return BenchmarkEventBus.instance;
    }

    public subscribe(event: BenchmarkEvents, callback: (data: any) => void) {
        this.mesh.subscribe(event, (meshEvent) => {
            callback(meshEvent.payload);
        });
    }

    public publish(event: BenchmarkEvents, data: any) {
        console.log(`[HCNS-01] [HBII] Publishing: ${event}`);
        this.mesh.publish({
            type: event,
            domain: CognitiveDomain.SYSTEM,
            priority: EventPriority.NORMAL,
            source: "HBII",
            payload: data
        });
    }
}

