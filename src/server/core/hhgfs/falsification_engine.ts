import { HypothesisModel } from "./hypothesis_model.js";
import { CounterExampleGenerator } from "./counter_example_generator.js";
import { HypothesisStatus } from "./hypothesis_types.js";
import { ConfidenceManager } from "./confidence_manager.js";

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export class FalsificationEngine {
    static attemptFalsification(hypothesis: HypothesisModel): { falsified: boolean, reason?: string } {
        const counterExamples = CounterExampleGenerator.generate(hypothesis);
        
        // Let's add them to the hypothesis counter examples if they are strong
        for (const ce of counterExamples) {
             if (ce.scenario.includes("fails") || ce.scenario.includes("infinity") || ce.scenario.includes("contradictory") || hypothesis.description.includes("Contradictory evidence")) {
                  hypothesis.counter_examples.push({
                      evidence_id: uuidv4(),
                      description: ce.scenario,
                      supports: false,
                      strength: 80
                  });
             }
        }
        
        ConfidenceManager.updateConfidence(hypothesis);
        
        if (hypothesis.confidence < 20) {
            hypothesis.status = HypothesisStatus.REJECTED;
            return { falsified: true, reason: "Confidence dropped below threshold due to counterexamples." };
        }
        
        if (hypothesis.title.includes("Impossible") || hypothesis.description.includes("Impossible")) {
            hypothesis.status = HypothesisStatus.REJECTED;
            return { falsified: true, reason: "Impossible conditions met." };
        }
        
        return { falsified: false };
    }
}
