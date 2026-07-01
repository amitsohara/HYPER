import { SocietyHealthMetrics, SpecialistStatus } from "./types.js";
import { SpecialistRegistry } from "./specialistRegistry.js";

export class SocietyHealthMonitor {
    private metrics: SocietyHealthMetrics = {
        activeSpecialists: 0,
        failures: 0,
        responseTimesAvg: 0,
        communicationQuality: 1.0,
        taskCompletionRate: 1.0,
        collaborationMetrics: {},
        overallScore: 1.0
    };

    constructor(private registry: SpecialistRegistry) {}

    public updateHealth(): void {
        const specialists = this.registry.getAll();
        
        let activeCount = 0;
        let failureCount = 0;

        for (const specialist of specialists) {
            const health = specialist.getHealth();
            if (health.status === SpecialistStatus.ACTIVE) {
                activeCount++;
            } else if (health.status === SpecialistStatus.ERROR) {
                failureCount++;
            }
        }

        this.metrics.activeSpecialists = activeCount;
        this.metrics.failures = failureCount;
        
        // Simple heuristic for overall score
        const total = specialists.length;
        if (total === 0) {
            this.metrics.overallScore = 0;
        } else {
            this.metrics.overallScore = activeCount / total;
        }
    }

    public getMetrics(): SocietyHealthMetrics {
        this.updateHealth();
        return this.metrics;
    }
}
