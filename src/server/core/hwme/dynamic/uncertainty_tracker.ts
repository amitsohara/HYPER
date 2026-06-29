export class UncertaintyTracker {
    static updateUncertainty(currentUncertainty: number, evidenceConfidence: number): number {
        // Simple Bayesian-ish update: high evidence confidence reduces uncertainty
        let newUncertainty = currentUncertainty * (1 - (evidenceConfidence / 100) * 0.1);
        return Math.max(0, Math.min(100, newUncertainty));
    }
}
