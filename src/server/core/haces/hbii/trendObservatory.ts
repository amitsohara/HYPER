import { IntelligenceTrend, IntelligenceProfile } from "./benchmarkTypes.js";
import { BenchmarkEventBus, BenchmarkEvents } from "./benchmarkEvents.js";

export class IntelligenceTrendObservatory {
    private eventBus = BenchmarkEventBus.getInstance();
    private profiles: IntelligenceProfile[] = [];

    public addProfile(profile: IntelligenceProfile) {
        this.profiles.push(profile);
        this.analyzeTrends();
    }

    public analyzeTrends(): IntelligenceTrend | null {
        if (this.profiles.length < 2) return null;
        
        const sorted = [...this.profiles].sort((a, b) => a.timestamp - b.timestamp);
        const latest = sorted[sorted.length - 1];
        const oldest = sorted[0];

        const trend: IntelligenceTrend = {
            period: 'GENERATIONAL',
            start_time: oldest.timestamp,
            end_time: latest.timestamp,
            cii_start: oldest.continuous_intelligence_index,
            cii_end: latest.continuous_intelligence_index,
            growth_rate: ((latest.continuous_intelligence_index - oldest.continuous_intelligence_index) / (oldest.continuous_intelligence_index || 1)) * 100,
            forecasted_cii: latest.continuous_intelligence_index * 1.05 // naive 5% forecast
        };

        this.eventBus.publish(BenchmarkEvents.TREND_UPDATED, trend);
        return trend;
    }
}
