import { HypothesisModel } from "./hypothesis_model.js";

export class HypothesisMetrics {
    static getMetrics(hypotheses: HypothesisModel[]) {
        return {
            total: hypotheses.length,
            candidates: hypotheses.filter(h => h.status === "CANDIDATE").length,
            testing: hypotheses.filter(h => h.status === "TESTING").length,
            validated: hypotheses.filter(h => h.status === "VALIDATED").length,
            rejected: hypotheses.filter(h => h.status === "REJECTED").length
        };
    }
}
