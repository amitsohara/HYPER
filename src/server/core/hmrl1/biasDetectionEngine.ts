import { BiasReport, CognitiveBiasType } from "./types.js";

export class BiasDetectionEngine {
    public detectBias(
        hypothesesCount: number, 
        evidenceCount: number, 
        contradictionsCount: number
    ): BiasReport[] {
        const reports: BiasReport[] = [];

        if (hypothesesCount === 1 && evidenceCount > 3 && contradictionsCount === 0) {
            reports.push({
                type: CognitiveBiasType.PREMATURE_CLOSURE,
                severity: 0.6,
                description: "Only one hypothesis maintained despite ample evidence, indicating possible premature convergence.",
                affectedThoughtIds: []
            });
        }

        if (evidenceCount > 5 && contradictionsCount > 2) {
            reports.push({
                type: CognitiveBiasType.CONTRADICTION_BLINDNESS,
                severity: 0.7,
                description: "High evidence and multiple contradictions suggest reasoning may be ignoring conflicting data.",
                affectedThoughtIds: []
            });
        }

        return reports;
    }
}
