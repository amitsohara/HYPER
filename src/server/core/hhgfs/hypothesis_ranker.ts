import { HypothesisModel } from "./hypothesis_model.js";

export class HypothesisRanker {
    static rank(hypotheses: HypothesisModel[]): HypothesisModel[] {
        return hypotheses.sort((a, b) => b.confidence - a.confidence);
    }
}
