export class ConfidenceEngine {
    
    public calculateOverallConfidence(specialistConfidences: Record<string, number>): number {
        const values = Object.values(specialistConfidences);
        if (values.length === 0) return 0;

        // Simple average for now
        const sum = values.reduce((a, b) => a + b, 0);
        return sum / values.length;
    }
}
