import { HypothesisModel } from "./hypothesis_model.js";

export class ConfidenceManager {
    static updateConfidence(hypothesis: HypothesisModel) {
        let pro = hypothesis.supporting_evidence.reduce((sum, e) => sum + e.strength, 0);
        let con = hypothesis.counter_examples.reduce((sum, e) => sum + e.strength, 0);
        
        let newConf = hypothesis.confidence + (pro * 0.1) - (con * 0.2);
        hypothesis.confidence = Math.max(0, Math.min(100, newConf));
    }
}
