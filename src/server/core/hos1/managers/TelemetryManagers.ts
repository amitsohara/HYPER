import { HealthStatus } from "../types.js";
import { v4 as uuidv4 } from "uuid";

export class MetricsCollector {
    private metrics: Record<string, number[]> = {};

    record(metric: string, value: number) {
        if (!this.metrics[metric]) this.metrics[metric] = [];
        this.metrics[metric].push(value);
    }
}

export class HealthManager {
    private statuses: Map<string, HealthStatus> = new Map();

    reportHealth(subsystem: string, isHealthy: boolean, metrics: Record<string, number>) {
        this.statuses.set(subsystem, {
            id: `hlth-${uuidv4()}`,
            subsystem,
            isHealthy,
            metrics,
            timestamp: Date.now()
        });
    }

    isSystemHealthy(): boolean {
        for (const status of this.statuses.values()) {
            if (!status.isHealthy) return false;
        }
        return true;
    }
}

export class TelemetryManager {
    public metrics = new MetricsCollector();
    public health = new HealthManager();
}
