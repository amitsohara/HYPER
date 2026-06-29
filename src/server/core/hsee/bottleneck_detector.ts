import { PerformanceMetrics } from "./evolution_types.js";

export class BottleneckDetector {
    static detect(metrics: PerformanceMetrics, evaluation: any): string[] {
        const bottlenecks: string[] = [];
        
        if (metrics.execution_time_ms > 5000) bottlenecks.push("SLOW_MODULES");
        if (metrics.mission_success < 50) bottlenecks.push("REPEATED_FAILURES");
        if (metrics.attention_efficiency < 50) bottlenecks.push("WEAK_ATTENTION_POLICIES");
        if (evaluation.branches_excessive) bottlenecks.push("OVERTHINKING");
        if (evaluation.stopped_early) bottlenecks.push("UNDERTHINKING");
        if (!evaluation.confidence_matched) bottlenecks.push("POOR_CONFIDENCE_CALIBRATION");
        
        return bottlenecks;
    }
}
