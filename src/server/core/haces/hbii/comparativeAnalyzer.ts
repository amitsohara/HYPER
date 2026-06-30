import { IntelligenceProfile } from "./benchmarkTypes.js";

export class ComparativeIntelligenceAnalyzer {
    
    public compareProfiles(profiles: IntelligenceProfile[]): any {
        if (profiles.length < 2) return null;
        
        // Sort by timestamp
        const sorted = [...profiles].sort((a, b) => a.timestamp - b.timestamp);
        
        const latest = sorted[sorted.length - 1];
        const previous = sorted[sorted.length - 2];
        const baseline = sorted[0];
        
        return {
            latest_version: latest.version,
            cii_growth_from_baseline: latest.continuous_intelligence_index - baseline.continuous_intelligence_index,
            cii_growth_from_previous: latest.continuous_intelligence_index - previous.continuous_intelligence_index
        };
    }
}
