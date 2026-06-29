import { Bottleneck, MetricCategory, CognitiveHealthProfile } from "./observabilityTypes.js";
import { ObservabilityEventBus, ObservabilityEvents } from "./observabilityEvents.js";

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export class BottleneckDetector {
    private bottlenecks: Bottleneck[] = [];
    private eventBus = ObservabilityEventBus.getInstance();

    public detect(healthProfile: CognitiveHealthProfile): Bottleneck[] {
        const newBottlenecks: Bottleneck[] = [];

        for (const [key, metric] of Object.entries(healthProfile.metrics)) {
            if (metric.current_value < 70) {
                const bottleneck: Bottleneck = {
                    bottleneck_id: uuidv4(),
                    category: metric.category,
                    description: `${metric.category} performance is degrading.`,
                    impact_score: 100 - metric.current_value,
                    detected_at: Date.now(),
                    is_active: true
                };
                newBottlenecks.push(bottleneck);
                this.bottlenecks.push(bottleneck);
                this.eventBus.publish(ObservabilityEvents.BOTTLENECK_DETECTED, { bottleneck });
            }
        }

        return newBottlenecks;
    }

    public getActiveBottlenecks(): Bottleneck[] {
        return this.bottlenecks.filter(b => b.is_active);
    }
    
    public resolveBottleneck(id: string) {
        const b = this.bottlenecks.find(b => b.bottleneck_id === id);
        if (b) b.is_active = false;
    }
}
