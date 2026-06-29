import { CognitiveHealthProfile, MetricCategory, HealthMetric } from "./observabilityTypes.js";
import { ObservabilityEventBus, ObservabilityEvents } from "./observabilityEvents.js";
import { TelemetryCollector } from "./telemetryCollector.js";

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export class CognitiveHealthIndex {
    private eventBus = ObservabilityEventBus.getInstance();
    private collector: TelemetryCollector;

    constructor(collector: TelemetryCollector) {
        this.collector = collector;
    }

    public computeHealth(): CognitiveHealthProfile {
        const metrics: Record<string, HealthMetric> = {};
        let totalScore = 0;
        let count = 0;

        for (const cat in MetricCategory) {
            const category = MetricCategory[cat as keyof typeof MetricCategory];
            const samples = this.collector.getSamplesByCategory(category);
            
            // Mock computation based on samples
            const currentValue = samples.length > 0 ? samples.reduce((acc, s) => acc + s.value, 0) / samples.length : 85;
            
            metrics[category] = {
                category,
                current_value: currentValue,
                historical_trend: currentValue > 90 ? "IMPROVING" : currentValue < 70 ? "DEGRADING" : "STABLE",
                confidence: 80 + Math.min(samples.length, 15),
                contributing_factors: ["Recent performance", "Error rates"],
                recommended_actions: currentValue < 70 ? [`Investigate ${category} degradation`] : []
            };
            totalScore += currentValue;
            count++;
        }

        const overall_health_score = count > 0 ? totalScore / count : 100;

        const profile: CognitiveHealthProfile = {
            profile_id: uuidv4(),
            timestamp: Date.now(),
            metrics,
            overall_health_score
        };

        this.eventBus.publish(ObservabilityEvents.HEALTH_UPDATED, { profile });
        return profile;
    }
}
