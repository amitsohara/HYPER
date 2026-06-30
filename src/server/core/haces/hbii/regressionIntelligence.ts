import { v4 as uuidv4 } from "uuid";
import { IntelligenceProfile, RegressionAnalysis, CapabilityCategory } from "./benchmarkTypes.js";
import { BenchmarkEventBus, BenchmarkEvents } from "./benchmarkEvents.js";
import { BenchmarkMetrics } from "./benchmarkMetrics.js";

export class RegressionIntelligenceEngine {
    private eventBus = BenchmarkEventBus.getInstance();

    public analyzeRegressions(baseProfile: IntelligenceProfile, targetProfile: IntelligenceProfile): RegressionAnalysis {
        const regressions: { category: CapabilityCategory; severity: 'LOW'|'MEDIUM'|'HIGH'; description: string }[] = [];
        const improvements: { category: CapabilityCategory; description: string }[] = [];

        for (const cat of Object.keys(targetProfile.capabilities) as CapabilityCategory[]) {
            const baseScore = baseProfile.capabilities[cat]?.score || 0;
            const targetScore = targetProfile.capabilities[cat]?.score || 0;
            const diff = targetScore - baseScore;

            if (diff < -5) {
                regressions.push({
                    category: cat,
                    severity: diff < -15 ? 'HIGH' : (diff < -10 ? 'MEDIUM' : 'LOW'),
                    description: `Score dropped by ${Math.abs(diff)} points.`
                });
            } else if (diff > 5) {
                improvements.push({
                    category: cat,
                    description: `Score improved by ${diff} points.`
                });
            }
        }

        const analysis: RegressionAnalysis = {
            analysis_id: uuidv4(),
            timestamp: Date.now(),
            base_version: baseProfile.version,
            target_version: targetProfile.version,
            regressions_detected: regressions,
            improvements_detected: improvements,
            statistical_confidence: 95
        };

        if (regressions.length > 0) {
            BenchmarkMetrics.regressions_detected += regressions.length;
            this.eventBus.publish(BenchmarkEvents.REGRESSION_DETECTED, analysis);
        }
        if (improvements.length > 0) {
            BenchmarkMetrics.improvements_detected += improvements.length;
            this.eventBus.publish(BenchmarkEvents.IMPROVEMENT_DETECTED, analysis);
        }

        return analysis;
    }
}
