import { HypothesisModel } from "./hypothesis_model.js";
import { Prediction } from "./hypothesis_types.js";

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export class HypothesisPredictor {
    static generatePredictions(hypothesis: HypothesisModel): Prediction[] {
        const predictions: Prediction[] = [];
        if (hypothesis.title.includes("Biological Filtration")) {
            predictions.push({
                prediction_id: uuidv4(),
                description: "Biomass will increase over time.",
                expected_outcome: "Positive net biomass production",
                confidence: 70
            });
        } else if (hypothesis.title.includes("Distillation")) {
             predictions.push({
                prediction_id: uuidv4(),
                description: "Energy consumption will be directly proportional to volume of water.",
                expected_outcome: "Linear energy usage graph",
                confidence: 85
            });
        } else {
             predictions.push({
                prediction_id: uuidv4(),
                description: `Default prediction for ${hypothesis.title}`,
                expected_outcome: "Expected state change",
                confidence: 50
            });
        }
        return predictions;
    }
}
