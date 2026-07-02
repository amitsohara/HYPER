import { ArbitrationMetrics } from "../types/index.js";

export class TelemetryCollector {
    private metrics: ArbitrationMetrics = {
        totalRequests: 0,
        internalSuccesses: 0,
        externalInvocations: 0,
        averageConfidence: 0,
        hallucinationCount: 0,
        totalCost: 0,
        averageLatency: 0,
        knowledgeGapResolutions: 0
    };

    recordArbitration(useExternal: boolean, confidence: number) {
        this.metrics.totalRequests++;
        if (useExternal) {
            this.metrics.externalInvocations++;
            this.metrics.knowledgeGapResolutions++;
        } else {
            this.metrics.internalSuccesses++;
        }

        // Running average
        this.metrics.averageConfidence = 
            ((this.metrics.averageConfidence * (this.metrics.totalRequests - 1)) + confidence) / this.metrics.totalRequests;
    }

    recordExternalExecution(cost: number, latencyMs: number) {
        this.metrics.totalCost += cost;
        
        const prevCount = this.metrics.externalInvocations - 1; // Assuming it was incremented above
        if (prevCount > 0) {
            this.metrics.averageLatency = 
                ((this.metrics.averageLatency * prevCount) + latencyMs) / this.metrics.externalInvocations;
        } else {
            this.metrics.averageLatency = latencyMs;
        }
    }

    recordValidationFailure() {
        this.metrics.hallucinationCount++;
    }

    getMetrics(): ArbitrationMetrics {
        return { ...this.metrics };
    }
}

export class AuditLogger {
    log(event: string, details: any) {
        console.log(`[HILA-AUDIT] ${event}:`, JSON.stringify(details));
    }
}
