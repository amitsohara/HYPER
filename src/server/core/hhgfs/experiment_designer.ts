import { HypothesisModel } from "./hypothesis_model.js";
import { Experiment } from "./hypothesis_types.js";

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export class ExperimentDesigner {
    static design(hypothesis: HypothesisModel): Experiment[] {
        const experiments: Experiment[] = [];
        experiments.push({
            experiment_id: uuidv4(),
            description: `Test core assumption of ${hypothesis.title}`,
            success_criteria: ["Assumption holds under stress"],
            failure_criteria: ["Assumption breaks"],
            required_data: ["Baseline metrics", "Test metrics"]
        });
        return experiments;
    }
}
