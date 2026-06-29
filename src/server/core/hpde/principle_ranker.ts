import { PrincipleModel } from "./principle_model.js";

export class PrincipleRanker {
    static computeScore(principle: PrincipleModel): number {
        const m = principle.metrics;
        if (!m) return 0;
        return (m.predictive_power * 0.3) +
               (m.cross_domain_applicability * 0.2) +
               (m.evidence_strength * 0.2) +
               (m.simplicity * 0.1) +
               (m.novelty * 0.1) +
               (m.robustness * 0.1);
    }

    static rank(principles: PrincipleModel[]): PrincipleModel[] {
        return principles.sort((a, b) => this.computeScore(b) - this.computeScore(a));
    }
}
