import { TrendAnalysis } from "./observabilityTypes.js";
import { TelemetryCollector } from "./telemetryCollector.js";
import { ObservabilityEventBus, ObservabilityEvents } from "./observabilityEvents.js";
import { ObservabilityPolicies } from "./observabilityPolicies.js";

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export class TrendAnalyzer {
    private collector: TelemetryCollector;
    private eventBus = ObservabilityEventBus.getInstance();

    constructor(collector: TelemetryCollector) {
        this.collector = collector;
    }

    public analyze(metric_name: string): TrendAnalysis {
        const samples = this.collector.getSamples().filter(s => s.metric_name === metric_name);
        // Simple mock trend analysis
        const magnitude = samples.length > 1 ? samples[samples.length-1].value - samples[0].value : 0;
        const direction = magnitude > 0 ? "UP" : magnitude < 0 ? "DOWN" : "FLAT";
        
        const trend: TrendAnalysis = {
            trend_id: uuidv4(),
            metric_name,
            direction,
            magnitude,
            significance: Math.abs(magnitude) > 5 ? 90 : 20,
            start_time: samples.length > 0 ? samples[0].timestamp : Date.now(),
            end_time: Date.now()
        };

        this.eventBus.publish(ObservabilityEvents.TREND_DETECTED, { trend });

        if (direction === "DOWN" && ObservabilityPolicies.shouldFlagRegression(magnitude, trend.significance)) {
            this.eventBus.publish(ObservabilityEvents.REGRESSION_DETECTED, { trend });
        } else if (direction === "UP" && trend.significance > 80) {
            this.eventBus.publish(ObservabilityEvents.CAPABILITY_IMPROVED, { trend });
        }

        return trend;
    }
}
