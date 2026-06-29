import { TelemetrySample, MetricCategory } from "./observabilityTypes.js";
import { ObservabilityEventBus, ObservabilityEvents } from "./observabilityEvents.js";

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export class TelemetryCollector {
    private samples: TelemetrySample[] = [];
    private eventBus = ObservabilityEventBus.getInstance();

    public record(category: MetricCategory, metric_name: string, value: number, context?: any): TelemetrySample {
        const sample: TelemetrySample = {
            sample_id: uuidv4(),
            category,
            metric_name,
            value,
            timestamp: Date.now(),
            context
        };
        this.samples.push(sample);
        this.eventBus.publish(ObservabilityEvents.TELEMETRY_COLLECTED, { sample });
        return sample;
    }

    public getSamples(): TelemetrySample[] {
        return this.samples;
    }

    public getSamplesByCategory(category: MetricCategory): TelemetrySample[] {
        return this.samples.filter(s => s.category === category);
    }
    
    public clearOldSamples(beforeTimestamp: number) {
        this.samples = this.samples.filter(s => s.timestamp >= beforeTimestamp);
    }
}
