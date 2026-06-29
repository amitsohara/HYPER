export class ObservabilityPolicies {
    public static shouldFlagRegression(trendMagnitude: number, confidence: number): boolean {
        // Flag if downward trend magnitude is significant and confidence is high
        return trendMagnitude < -5 && confidence > 80;
    }

    public static isEvolutionReady(readinessScore: number, riskLevel: number): boolean {
        // High readiness score and low/medium risk required
        return readinessScore >= 75 && riskLevel <= 40;
    }
}
