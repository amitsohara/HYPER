import { CognitiveLoadMetrics } from "./types.js";

export class CognitiveLoadManager {
    private metrics: CognitiveLoadMetrics = {
        cpuBudget: 100,
        memoryBudget: 100,
        activeSpecialists: 0,
        pendingTasks: 0,
        queueDepth: 0,
        latency: 0
    };

    public updateMetrics(updates: Partial<CognitiveLoadMetrics>): void {
        this.metrics = { ...this.metrics, ...updates };
    }

    public canAcceptLoad(cost: number): boolean {
        return (this.metrics.cpuBudget > cost && this.metrics.memoryBudget > cost);
    }

    public getMetrics(): CognitiveLoadMetrics {
        return { ...this.metrics };
    }
}
