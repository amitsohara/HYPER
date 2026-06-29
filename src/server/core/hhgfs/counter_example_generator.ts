import { HypothesisModel } from "./hypothesis_model.js";

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export class CounterExampleGenerator {
    static generate(hypothesis: HypothesisModel): any[] {
        const counterExamples = [];
        if (hypothesis.title.includes("Biological Filtration")) {
             counterExamples.push({
                 id: uuidv4(),
                 scenario: "Radiation flare kills all plant life instantly",
                 type: "Extreme environment"
             });
        } else if (hypothesis.title.includes("Triage")) {
             counterExamples.push({
                 id: uuidv4(),
                 scenario: "AI system goes down due to network failure, increasing wait time to infinity",
                 type: "Adversarial scenario"
             });
        } else {
             counterExamples.push({
                 id: uuidv4(),
                 scenario: `Edge case for ${hypothesis.title}`,
                 type: "Edge case"
             });
        }
        return counterExamples;
    }
}
